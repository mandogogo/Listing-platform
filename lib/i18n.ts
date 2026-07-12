import "server-only";
import { cookies } from "next/headers";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

const dictionaries = { ar, en };

export async function getLocale(): Promise<"ar" | "en"> {
  const cookieStore = await cookies();
  return (cookieStore.get("locale")?.value as "ar" | "en") ?? "ar";
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
