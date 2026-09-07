import type { RetailerId } from "@/lib/document-extract/aliases";

/** Flipkart listing verticals that appear above the real product title. */
const FLIPKART_VERTICAL = /^(true wireless|trimmers?|wrist watches?|fresh vegetable|with call function|handsets?|mobiles?|smart watches?|smartwatch|headphones?|speakers?|clogs?)$/i;

const FEE_PAGE =
  /\b(platform fee|convenience fee|protect promise fee|cash\s*\/\s*pay on delivery|cod fee|gt charges)\b/i;

const NON_GOODS_PAGE =
  /\b(bill of supply|credit note|goods carriage|gta\s|consignor details|nature of transaction)\b/i;

export function splitDocumentPages(text: string): string[] {
  const parts = text
    .split(/\n\s*--\s*\d+\s+of\s+\d+\s*--\s*\n/i)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts : [text];
}

export function scoreMarketplacePage(page: string): number {
  let score = 0;
  const lower = page.toLowerCase();

  if (/product\s*title/i.test(page)) score += 10;
  if (/keep this invoice and\s*manufacturer box/i.test(page)) score += 6;
  if (/warranty\s*:/i.test(page)) score += 8;
  if (/imei\s*\/\s*s(?:erial|r)/i.test(page)) score += 5;
  if (/\bB0[A-Z0-9]{8,}\b/i.test(page)) score += 8;
  if (/hsn(?:\/sac)?\s*:?\s*\d{4,}/i.test(page)) score += 4;
  if (/fsn\s*:/i.test(page)) score += 4;
  if (/\b(airdopes?|earbuds?|buds|sneakers?|clogs?|smartwatch|trimmer|watch)\b/i.test(page)) {
    score += 3;
  }
  if (/\[\[\s*[A-Z0-9]{5,}\s*\]\]/.test(page)) score += 5;

  if (FEE_PAGE.test(page) && !/product\s*title/i.test(page) && !/\bB0[A-Z0-9]{8,}\b/i.test(page)) {
    score -= 16;
  }
  if (NON_GOODS_PAGE.test(page) && !/product\s*title/i.test(page) && !/ordered through/i.test(lower)) {
    score -= 18;
  }
  if (/fresh vegetable|\bonion\b/i.test(page) && !/warranty\s*:/i.test(page)) {
    score -= 10;
  }

  const amounts = collectPageAmounts(page);
  const max = amounts.length ? Math.max(...amounts) : 0;
  if (max >= 100) score += 3;
  if (max >= 500) score += 3;

  return score;
}

export function selectPrimaryInvoiceText(text: string, retailer: RetailerId): string {
  if (retailer !== "amazon" && retailer !== "flipkart") {
    return text;
  }

  const pages = splitDocumentPages(text);
  if (pages.length <= 1) return text;

  let best = pages[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const page of pages) {
    const score = scoreMarketplacePage(page);
    if (score > bestScore) {
      bestScore = score;
      best = page;
    }
  }

  return bestScore > 0 ? best : text;
}

function collectPageAmounts(page: string): number[] {
  const amounts: number[] = [];

  for (const match of page.matchAll(
    /grand\s*total\s*(?:₹|rs\.?|inr)?\s*([\d,]+\.?\d*)/gi
  )) {
    pushAmount(amounts, match[1]);
  }

  for (const match of page.matchAll(
    /total\s*price\s*[:\-]?\s*(?:₹|rs\.?)?\s*([\d,]+\.?\d*)/gi
  )) {
    pushAmount(amounts, match[1]);
  }

  const totalLine = page.match(/^\s*TOTAL:\s*(.+)$/im);
  if (totalLine?.[1]) {
    const nums = [...totalLine[1].matchAll(/([\d,]+\.\d{2})/g)];
    if (nums.length) {
      pushAmount(amounts, nums[nums.length - 1][1]);
    }
  }

  return amounts;
}

function pushAmount(target: number[], raw: string | undefined) {
  if (!raw) return;
  const amount = Number.parseFloat(raw.replace(/,/g, ""));
  if (Number.isFinite(amount) && amount > 0) {
    target.push(amount);
  }
}

export function marketplacePurchaseAmount(page: string): string {
  const amounts = collectPageAmounts(page);
  if (!amounts.length) return "";
  const max = Math.max(...amounts);
  return String(max);
}

export function marketplaceInvoiceNumber(page: string, retailer: RetailerId): string {
  if (retailer === "amazon") {
    const invoice = page.match(
      /invoice\s*number\s*[:#]?\s*([A-Z0-9][A-Z0-9\-\/]{4,40})/i
    );
    if (invoice?.[1] && !/^POD-/i.test(invoice[1])) {
      return invoice[1];
    }

    const order = page.match(/\b(\d{3}-\d{7}-\d{7})\b/);
    if (order?.[1]) return order[1];
  }

  const hashed = page.match(
    /invoice\s*(?:number|no)\s*#?\s*[:#]?\s*([A-Z0-9][A-Z0-9\-\/]{6,40})/i
  );
  if (hashed?.[1] && !/^OD\d+/i.test(hashed[1])) {
    return hashed[1].replace(/^#+/, "");
  }

  const invoiceNo = page.match(
    /invoice\s*no\.?\s*[:#]?\s*([A-Z0-9][A-Z0-9\-\/]{6,40})/i
  );
  if (invoiceNo?.[1]) return invoiceNo[1];

  const orderId = page.match(/\b(OD\d{10,})\b/i);
  if (orderId?.[1]) return orderId[1];

  return "";
}

export function marketplaceDateRaw(page: string): string {
  const labelled = page.match(
    /(?:invoice\s*date|order\s*date)\s*[:\-]?\s*([0-9]{1,2}[./\-][0-9]{1,2}[./\-][0-9]{2,4})/i
  );
  if (labelled?.[1]) return labelled[1];

  const beforeLabel = page.match(
    /\b([0-9]{1,2}[./\-][0-9]{1,2}[./\-][0-9]{2,4})\s+(?:invoice\s*date|order\s*date)\b/i
  );
  return beforeLabel?.[1] ?? "";
}

export function marketplaceGstin(page: string): string {
  const labelled = page.match(
    /(?:gst\s*registration\s*no|gstin|gst)\s*[:\-]?\s*([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z])/i
  );
  if (labelled?.[1]) return labelled[1].toUpperCase();

  const before = page.match(
    /\b([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z])\s+GSTIN\b/i
  );
  return before?.[1]?.toUpperCase() ?? "";
}

export function marketplaceSerial(page: string): string {
  const bracketed = page.match(
    /imei\s*\/\s*s(?:erial|r)\s*(?:no)?\s*[:\-]?\s*\[\[\s*([A-Z0-9]{5,})\s*\]\]/i
  );
  if (bracketed?.[1]) return bracketed[1];

  const labelled = page.match(
    /\[?\s*imei\s*\/\s*serial\s*(?:no|number)?\s*[:\-]?\s*([A-Z0-9]{6,})\s*\]?/i
  );
  if (labelled?.[1] && labelled[1] !== "SrNo") return labelled[1];

  return "";
}

export function marketplaceProductName(page: string, retailer: RetailerId): string {
  if (retailer === "amazon") {
    const asinLine = page.match(
      /^\s*\d+\s+((?:[A-Z][^\n]{6,140}?)(?:\s*\|\s*[^\n]+)?)\s*\(\s*B0[A-Z0-9]+/im
    );
    if (asinLine?.[1]) {
      return cleanProductName(asinLine[1].replace(/\s*\|\s*B0[A-Z0-9]+.*$/i, ""));
    }

    const numbered = page.match(
      /^\s*\d+\s+([A-Z][^\n]{8,120}?)\s+(?:₹|rs\.?|hsn)/im
    );
    if (numbered?.[1] && !FEE_PAGE.test(numbered[1])) {
      return cleanProductName(numbered[1]);
    }
  }

  return extractFlipkartGoodsName(page);
}

function extractFlipkartGoodsName(page: string): string {
  const block = page.match(
    /product\s*title[\s\S]*?total\s*₹\s*\n([\s\S]+?)(?:\n\s*warranty\s*:|\n\s*\d+\s+[\d,]+\.\d{2}|\n\s*handling fee|\n\s*grand\s*total)/i
  );

  const fallback = page.match(
    /(?:description|product)\s+qty[\s\S]{0,200}?\n([\s\S]{8,400}?)(?:\n\s*hsn:|\n\s*shipping and handling)/i
  );

  const body = block?.[1] ?? fallback?.[1] ?? "";
  if (!body) {
    const redTape = page.match(/RED\s+TAPE[^\n]{0,80}/i);
    if (redTape?.[0]) return cleanProductName(redTape[0]);
    return "";
  }

  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const collected: string[] = [];

  for (const line of lines) {
    if (/^(fsn|hsn\/sac|hsn|sac)\s*:/i.test(line)) continue;
    if (/^fsn:?$/i.test(line)) continue;
    if (/^[A-Z0-9]{10,20}$/i.test(line) && collected.length === 0) continue;
    if (FLIPKART_VERTICAL.test(line)) continue;
    if (/^\[?\s*imei/i.test(line)) break;
    if (/handling fee/i.test(line)) break;
    if (/^\d+\s+[\d,]+\.\d{2}/.test(line)) break;
    if (/^\d+\.\d+\s*%/.test(line)) continue;
    if (/^(sgst|cgst|igst|utgst)/i.test(line)) continue;

    collected.push(line.replace(/,$/, ""));
  }

  if (collected.length) {
    return cleanProductName(collected.join(" "));
  }

  const sellerLine = page.match(
    /(?:ordered through[\s\S]{0,80})?(RED\s+TAPE[^\n]{5,90})/i
  );
  return sellerLine?.[1] ? cleanProductName(sellerLine[1]) : "";
}

function cleanProductName(value: string) {
  return value
    .replace(/\s*FSN\s*:.*$/i, "")
    .replace(/\s*HSN\s*:.*$/i, "")
    .replace(/\s*\|\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 140);
}
