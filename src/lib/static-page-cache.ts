/**
 * ISR for marketing / help pages (edge-friendly in production).
 * Route segments must use the literal `export const revalidate = 86_400` — Next.js
 * does not accept imported values for segment config.
 */
export const MARKETING_PAGE_REVALIDATE_SECONDS = 86_400;
