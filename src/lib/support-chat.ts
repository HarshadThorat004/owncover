import { FAQS } from "@/constants/faqs";
import { HELP_EXPLAINERS, HELP_GUIDES } from "@/constants/help-guides";

export const SUPPORT_CHAT_MAX_MESSAGE = 500;

export type SupportChatLink = { title: string; href: string };

export type SupportChatReply = {
  reply: string;
  links: SupportChatLink[];
};

type KnowledgeEntry = {
  id: string;
  title: string;
  body: string;
  href: string;
  keywords: string[];
};

const EXTRA_KEYWORDS: Record<string, string[]> = {
  "faq:gst-scan": ["qr", "ocr", "bill", "scan", "photo", "camera", "read"],
  "faq:scan-wrong": ["wrong", "mistake", "incorrect", "fix", "edit"],
  "faq:claim-pack": ["pack", "pdf", "print", "download", "claim"],
  "faq:covers": ["amc", "extended", "store", "croma", "dealer", "brand"],
  "faq:desks": ["where", "service", "centre", "center", "raise", "repair"],
  "faq:serial": ["serial", "imei", "sticker", "number"],
  "faq:forward": ["amazon", "flipkart", "forward", "email", "inbound", "inbox"],
  "faq:reminders": ["remind", "reminder", "alert", "notification", "notify", "calendar"],
  "faq:household": ["family", "share", "sharing", "invite", "member", "household"],
  "faq:ai": ["train", "ai", "privacy", "data", "sell"],
  "faq:sample": ["sample", "demo", "example", "try"],
  "faq:free": ["price", "pricing", "cost", "free", "pay", "paid", "charge"],
  "faq:delete": ["delete", "remove", "close", "erase", "export"],
  "faq:hindi": ["hindi", "language"],
  "faq:file-claims": ["file", "insurer", "insurance"],
};

const KNOWLEDGE: KnowledgeEntry[] = [
  ...FAQS.map((faq) => ({
    id: `faq:${faq.id}`,
    title: faq.q,
    body: faq.a,
    href: "/help#faq",
    keywords: EXTRA_KEYWORDS[`faq:${faq.id}`] ?? [],
  })),
  ...HELP_EXPLAINERS.map((item) => ({
    id: `explainer:${item.id}`,
    title: item.title,
    body: item.body,
    href: `/help#${item.id}`,
    keywords: EXTRA_KEYWORDS[`faq:${item.id}`] ?? [],
  })),
  ...HELP_GUIDES.map((guide) => ({
    id: `guide:${guide.slug}`,
    title: guide.title,
    body: `${guide.lede} ${guide.notes.join(" ")}`,
    href: `/help/${guide.slug}`,
    keywords: [guide.slug, guide.navLabel.toLowerCase()],
  })),
];

const STOPWORDS = new Set(
  "a an and are as at be can do does for from get go how i if in is it me my of on or out so the to what when where which who why will with work works working you your warranty warranties owncover".split(
    " "
  )
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9*#\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !STOPWORDS.has(token));
}

function tokenMatches(queryToken: string, entryToken: string) {
  if (queryToken === entryToken) return true;
  if (queryToken.length < 4 || entryToken.length < 4) return false;
  return entryToken.startsWith(queryToken) || queryToken.startsWith(entryToken);
}

function scoreEntry(queryTokens: string[], entry: KnowledgeEntry) {
  const strong = [...tokenize(entry.title), ...entry.keywords];
  const weak = tokenize(entry.body);
  let score = 0;

  for (const token of queryTokens) {
    if (strong.some((candidate) => tokenMatches(token, candidate))) score += 3;
    else if (weak.some((candidate) => tokenMatches(token, candidate))) score += 1;
  }

  return score;
}

const MIN_SCORE = 3;

export function matchHelpEntries(text: string, limit = 2): KnowledgeEntry[] {
  const queryTokens = tokenize(text);
  if (queryTokens.length === 0) return [];

  return KNOWLEDGE.map((entry) => ({ entry, score: scoreEntry(queryTokens, entry) }))
    .filter((item) => item.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}

const VAULT_QUESTION =
  /(my (vault|products?|items?|warrant\w*|cover)|expir\w* soon|ending soon|needs? (you|attention)|how many|what.*(expir|ending))/i;

export function isVaultQuestion(text: string) {
  return VAULT_QUESTION.test(text);
}

export type VaultSummary = {
  totalProducts: number;
  expiringProducts: number;
  expiredProducts: number;
  missingSerial: number;
  attentionProducts: number;
};

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function describeVault(summary: VaultSummary): string {
  if (summary.totalProducts === 0) {
    return "Your vault is empty. Scan a GST bill or load the sample TV from the dashboard to get started.";
  }

  const parts = [`You have ${plural(summary.totalProducts, "product")} in the vault.`];
  if (summary.expiringProducts > 0) {
    parts.push(`${plural(summary.expiringProducts, "cover")} end within 30 days.`);
  }
  if (summary.expiredProducts > 0) {
    parts.push(`${summary.expiredProducts} already expired.`);
  }
  if (summary.missingSerial > 0) {
    parts.push(`${plural(summary.missingSerial, "product")} still need a serial number.`);
  }
  if (summary.attentionProducts === 0) {
    parts.push("Nothing needs you right now.");
  }

  return parts.join(" ");
}

export function buildSupportReply(
  text: string,
  vault: VaultSummary | null
): SupportChatReply {
  if (isVaultQuestion(text)) {
    if (!vault) {
      return {
        reply: "Sign in and I can tell you what is in your vault and what is expiring soon.",
        links: [{ title: "Sign in", href: "/login" }],
      };
    }

    return {
      reply: describeVault(vault),
      links:
        vault.attentionProducts > 0
          ? [{ title: "See what needs you", href: "/dashboard" }]
          : [],
    };
  }

  const matches = matchHelpEntries(text);
  if (matches.length === 0) {
    return {
      reply:
        "I could not find that in the help pages. Try asking about GST scan, claim packs, reminders, store or AMC cover, or sharing a vault — or reach us from the contact page.",
      links: [
        { title: "Help centre", href: "/help" },
        { title: "Contact", href: "/contact" },
      ],
    };
  }

  const [best, ...rest] = matches;
  return {
    reply: best!.body,
    links: [best!, ...rest].map((entry) => ({ title: entry.title, href: entry.href })),
  };
}
