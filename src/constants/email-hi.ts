import { BRAND_NAME } from "@/constants/brand";

export const EMAIL_HI = {
  greeting: (name: string | null) => (name ? `नमस्ते ${name},` : "नमस्ते,"),
  reminderSubject: (type: string, coverLabel?: string | null) => {
    const cover = coverLabel || "वारंटी";
    const subjects: Record<string, string> = {
      expiring_30: `${cover} रिमाइंडर: 30 दिन में समाप्त`,
      expiring_7: `ज़रूरी: ${cover} 7 दिन में समाप्त`,
      expiring_1: `${cover} कल समाप्त हो रही है`,
      expired: `${cover} समाप्त हो गई है`,
      renewal_available: "वारंटी रिन्यूअल उपलब्ध है",
    };
    return subjects[type] ?? "वारंटी रिमाइंडर";
  },
  reminderMessage: (input: {
    type: string;
    product: string;
    expiry: string;
    coverLabel?: string | null;
    renewalNotes?: string | null;
  }) => {
    const cover = input.coverLabel || "वारंटी";
    const messages: Record<string, string> = {
      expiring_30: `${input.product} की ${cover} <strong>${input.expiry}</strong> को समाप्त होगी (30 दिन के अंदर)।`,
      expiring_7: `ज़रूरी: ${input.product} की ${cover} <strong>${input.expiry}</strong> को समाप्त होगी (7 दिन के अंदर)।`,
      expiring_1: `${input.product} की ${cover} कल (<strong>${input.expiry}</strong>) समाप्त हो रही है।`,
      expired: `${input.product} की ${cover} <strong>${input.expiry}</strong> को समाप्त हो गई।`,
      renewal_available: `${input.product} के लिए रिन्यूअल का विकल्प उपलब्ध है।${
        input.renewalNotes ? ` नोट: ${input.renewalNotes}` : ""
      }`,
    };
    return messages[input.type] ?? "आपकी वारंटी में एक अपडेट है।";
  },
  reminderAction: "दस्तावेज़ देखने और आगे की कार्रवाई के लिए डैशबोर्ड पर लॉग इन करें।",
  reminderFooter: `आपको यह ईमेल इसलिए मिला क्योंकि ${BRAND_NAME} में आपके रिमाइंडर चालू हैं।`,
  digestSubject: `${BRAND_NAME} — इस हफ़्ते आपका वॉल्ट`,
  digestIntro:
    "वॉल्ट पर एक नज़र — क्या जल्द समाप्त हो रहा है, किसका सीरियल नंबर नहीं है, और कौन से इनवॉइस अभी ड्राफ़्ट में हैं।",
  digestExpiring: "30 दिन में कवर समाप्त",
  digestMissingSerial: "सीरियल नंबर नहीं",
  digestDrafts: (count: number) =>
    count === 1
      ? "1 फ़ॉरवर्ड किया गया इनवॉइस पुष्टि का इंतज़ार कर रहा है।"
      : `${count} फ़ॉरवर्ड किए गए इनवॉइस पुष्टि का इंतज़ार कर रहे हैं।`,
  digestCta: "डैशबोर्ड खोलें",
  digestFooter:
    "सोमवार का वॉल्ट मेल। शांत हफ़्तों में कोई मेल नहीं — हम तभी भेजते हैं जब कुछ करना हो।",
  pushTitle: (type: string, coverLabel?: string | null) => {
    const cover = coverLabel || "वारंटी";
    const titles: Record<string, string> = {
      expiring_30: `${cover} 30 दिन में समाप्त`,
      expiring_7: `${cover} 7 दिन में समाप्त`,
      expiring_1: `${cover} कल समाप्त`,
      expired: `${cover} समाप्त हो गई`,
      renewal_available: "वारंटी रिन्यूअल उपलब्ध",
    };
    return titles[type] ?? "वारंटी रिमाइंडर";
  },
};
