export type Locale = "ar" | "en";

/**
 * Picks the correct localized field from a record that has *Ar/*En pairs,
 * e.g. localize(org, "name", "ar") -> org.nameAr
 */
export function localize<T extends Record<string, any>>(
  record: T,
  field: string,
  locale: Locale
): string {
  const key = `${field}${locale === "ar" ? "Ar" : "En"}`;
  return record[key] ?? record[`${field}${locale === "ar" ? "En" : "Ar"}`] ?? "";
}

export function getLocaleFromRequest(request: Request): Locale {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/locale=(ar|en)/);
  return (match?.[1] as Locale) ?? "ar";
}
