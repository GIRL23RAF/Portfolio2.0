/** Matches the Tailwind `max-sm` range, where desktop-only case studies and previews are disabled. */
export function isPhoneViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;
}
