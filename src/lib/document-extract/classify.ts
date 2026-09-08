import type { RetailerId } from "@/lib/document-extract/aliases";
import type { ProductCategoryId } from "@/constants/catalog";

const RETAILER_LABELS: Record<Exclude<RetailerId, "unknown">, string> = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  dmart: "DMart",
  croma: "Croma",
  reliance: "Reliance Digital",
  vijay_sales: "Vijay Sales",
  local: "Local store",
};

export function retailerDisplayName(retailer: RetailerId) {
  if (retailer === "unknown") return "";
  return RETAILER_LABELS[retailer];
}

export function inferCategory(
  name: string,
  extraText = ""
): ProductCategoryId | "" {
  const hay = `${name}\n${extraText}`.toLowerCase();

  // Wearables — check before phones/tv_audio so "Apple Watch" / "smartwatch" land here
  if (
    /\b(smartwatch|smart\s*watch|fitness\s*band|fitness\s*tracker|activity\s*tracker|apple\s*watch|galaxy\s*watch|fire[-\s]?boltt|noise\s*colorfit|boat\s*wave|amazfit|garmin|fitbit|mi\s*band)\b/.test(
      hay
    )
  ) {
    return "wearables";
  }

  // Gaming — check before computers/tv_audio (has "monitor"/"tv" style overlap)
  if (
    /\b(playstation|ps[345]|xbox|nintendo|switch\s*oled|switch\s*lite|dualsense|joy[-\s]?con|gamepad|gaming\s*console|gaming\s*chair)\b/.test(
      hay
    )
  ) {
    return "gaming";
  }

  // Cameras — check before phones ("lens" / "camera" could otherwise be ambiguous)
  if (
    /\b(dslr|mirrorless|camcorder|gopro|action\s*cam|action\s*camera|tripod|gimbal|camera\s*lens|zoom\s*lens|prime\s*lens|flash\s*speedlite|memory\s*card|sd\s*card)\b/.test(
      hay
    ) ||
    /\b(canon\s+eos|nikon\s+d\d|sony\s+alpha|fujifilm|lumix)\b/.test(hay)
  ) {
    return "cameras";
  }

  if (
    /\b(smartphone|handset|tablet|ipad|iphone|galaxy)\b/.test(hay) ||
    /\bphones?\b(?!\s*:)/.test(hay)
  ) {
    return "phones";
  }

  if (
    /\b(laptop|notebook|ultrabook|chromebook|macbook|desktop|monitor|keyboard|mouse|ssd|hdd|gpu|printer|scanner|router|modem|ups\b)\b/.test(
      hay
    )
  ) {
    return "computers";
  }

  if (
    /\b(tv|television|smart\s*tv|headphones?|earbuds?|earphones?|airdopes?|buds\b|airpods?|speaker|soundbar|home\s*theatre|home\s*theater|projector)\b/.test(
      hay
    )
  ) {
    return "tv_audio";
  }

  // Kitchen — check before generic appliances so "Microwave Oven" / "Mixer Grinder" land here
  if (
    /\b(microwave|oven|otg\b|induction|cooktop|chimney|hob\b|mixer|grinder|juicer|blender|kettle|toaster|sandwich\s*maker|coffee\s*maker|espresso|dishwasher|water\s*purifier|ro\b|food\s*processor|air\s*fryer|rice\s*cooker)\b/.test(
      hay
    )
  ) {
    return "kitchen";
  }

  // Personal care — check before appliances (trimmer/shaver used to fall in appliances)
  if (
    /\b(trimmer|shaver|epilator|hair\s*dryer|hairdryer|hair\s*straightener|straightener|curling\s*iron|beard\s*trimmer|body\s*groomer|electric\s*toothbrush|facial\s*cleanser|foot\s*spa)\b/.test(
      hay
    )
  ) {
    return "personal_care";
  }

  if (
    /\b(refrigerator|fridge|washer|washing\s*machine|ac\b|air\s*conditioner|split\s*ac|window\s*ac|geyser|water\s*heater|purifier|fan|ceiling\s*fan|cooler|inverter|vacuum|iron\s*box|steam\s*iron)\b/.test(
      hay
    )
  ) {
    return "appliances";
  }

  if (
    /\b(treadmill|exercise\s*bike|stationary\s*bike|elliptical|cross\s*trainer|dumbbell|kettlebell|yoga\s*mat|bench\s*press|home\s*gym|rowing\s*machine|skipping\s*rope|cricket\s*bat|badminton\s*racket|tennis\s*racket)\b/.test(
      hay
    )
  ) {
    return "fitness";
  }

  if (
    /\b(tyre|tire|car\s*battery|bike\s*battery|two[-\s]?wheeler|scooter|motorcycle|helmet|car\s*cover|dash\s*cam|engine\s*oil|brake\s*pad)\b/.test(
      hay
    )
  ) {
    return "automotive";
  }

  if (
    /\b(drill|cordless\s*drill|angle\s*grinder|jigsaw|circular\s*saw|chainsaw|sander|welding|soldering|screwdriver\s*set|impact\s*driver|hammer\s*drill|air\s*compressor)\b/.test(
      hay
    )
  ) {
    return "power_tools";
  }

  if (
    /\b(sofa|couch|recliner|mattress|bed\s*frame|wardrobe|dining\s*table|dining\s*set|study\s*table|office\s*chair|bookshelf|book\s*shelf|tv\s*unit|coffee\s*table)\b/.test(
      hay
    )
  ) {
    return "furniture";
  }

  return "";
}
