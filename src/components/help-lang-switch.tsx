"use client";

import { LOCALE_COOKIE, type Locale } from "@/lib/locale";

type Props = {
  locale: Locale;
  slug?: string;
};

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export default function HelpLangSwitch({ locale, slug }: Props) {
  const enHref = slug ? `/help/${slug}` : "/help";
  const hiHref = slug ? `/help/hi/${slug}` : "/help/hi";
  const active = "text-white";
  const idle = "text-cyan-300/90 underline-offset-2 hover:underline";

  return (
    <p className="text-sm text-gray-500">
      <a
        href={enHref}
        hrefLang="en"
        lang="en"
        aria-current={locale === "en" ? "page" : undefined}
        onClick={() => rememberLocale("en")}
        className={locale === "en" ? active : idle}
      >
        English
      </a>
      <span className="mx-2 text-gray-700">·</span>
      <a
        href={hiHref}
        hrefLang="hi"
        lang="hi"
        aria-current={locale === "hi" ? "page" : undefined}
        onClick={() => rememberLocale("hi")}
        className={locale === "hi" ? active : idle}
      >
        हिन्दी
      </a>
    </p>
  );
}
