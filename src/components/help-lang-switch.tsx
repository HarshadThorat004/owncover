type Props = {
  locale: "en" | "hi";
  slug?: string;
};

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
        className={locale === "hi" ? active : idle}
      >
        हिन्दी
      </a>
    </p>
  );
}
