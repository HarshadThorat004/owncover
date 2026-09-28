const SIZE_MAP = {
  sm: 32,
  md: 40,
  lg: 48,
} as const;

const WORDMARK_CLASS = {
  sm: "text-sm",
  md: "text-[15px]",
  lg: "text-base",
} as const;

type BrandLogoProps = {
  variant?: "mark" | "full";
  size?: keyof typeof SIZE_MAP;
  /** Extra line under the wordmark; pass false to hide */
  tagline?: string | false;
  className?: string;
  markClassName?: string;
};

export default function BrandLogo({
  variant = "full",
  size = "md",
  tagline,
  className = "",
  markClassName = "",
}: BrandLogoProps) {
  const px = SIZE_MAP[size];

  // Local SVG — plain img avoids next/image hydration mismatches on the mark.
  const mark = (
    // eslint-disable-next-line @next/next/no-img-element -- static SVG mark
    <img
      src="/brand/logo-mark.svg"
      alt="OwnCover"
      width={px}
      height={px}
      className={`brand-mark shrink-0 transition-transform duration-300 ${markClassName}`.trim()}
    />
  );

  if (variant === "mark") {
    return (
      <span
        className={`inline-flex shrink-0 ${className}`.trim()}
        style={{ width: px, height: px }}
        role="img"
        aria-label="OwnCover"
      >
        {mark}
      </span>
    );
  }

  const resolvedTagline =
    tagline === false ? null : typeof tagline === "string" ? tagline : null;

  return (
    <span
      className={`inline-flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`.trim()}
    >
      <span
        className="inline-flex shrink-0"
        style={{ width: px, height: px }}
        aria-hidden
      >
        {mark}
      </span>
      <span className="min-w-0 text-left">
        <span
          className={`font-display block font-medium tracking-tight text-white ${WORDMARK_CLASS[size]}`}
        >
          OwnCover
        </span>
        {resolvedTagline ? (
          <span className="mt-0.5 block truncate text-[11px] text-gray-500">
            {resolvedTagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
