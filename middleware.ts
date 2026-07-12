import { NextRequest, NextResponse } from "next/server";

const LOCALE_COOKIE = "locale";
const SUPPORTED_LOCALES = ["ar", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

// Countries that default to English. Everything else defaults to Arabic.
const ENGLISH_DEFAULT_COUNTRIES = new Set(["AE"]);

function detectLocaleFromCountry(countryCode: string | null): Locale {
  if (countryCode && ENGLISH_DEFAULT_COUNTRIES.has(countryCode.toUpperCase())) {
    return "en";
  }
  return "ar";
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. If the user already picked a language, respect it — don't override.
  const existingLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existingLocale && SUPPORTED_LOCALES.includes(existingLocale as Locale)) {
    response.headers.set("x-locale", existingLocale);
    return response;
  }

  // 2. No saved preference yet -> detect from country (geo header set by hosting platform,
  //    e.g. Vercel's `x-vercel-ip-country`, or fall back to Accept-Language).
  const countryCode = request.headers.get("x-vercel-ip-country");
  const locale = detectLocaleFromCountry(countryCode);

  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });
  response.headers.set("x-locale", locale);

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except static assets and API internals
    "/((?!_next/static|_next/image|favicon.ico|api/internal).*)",
  ],
};
