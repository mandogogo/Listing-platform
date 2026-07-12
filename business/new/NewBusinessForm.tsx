"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; label: string };
type CityOption = Option & { countryId: string };

export function NewBusinessForm({
  locale,
  categories,
  countries,
  cities,
}: {
  locale: "ar" | "en";
  categories: Option[];
  countries: Option[];
  cities: CityOption[];
}) {
  const router = useRouter();
  const isAr = locale === "ar";

  const [form, setForm] = useState({
    nameAr: "",
    nameEn: "",
    type: "company",
    descriptionAr: "",
    descriptionEn: "",
    countryId: countries[0]?.id ?? "",
    cityId: "",
    phone: "",
    whatsapp: "",
    categoryId: categories[0]?.id ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const availableCities = useMemo(
    () => cities.filter((c) => c.countryId === form.countryId),
    [cities, form.countryId]
  );

  const businessTypes = [
    { value: "company", labelAr: "شركة", labelEn: "Company" },
    { value: "factory", labelAr: "مصنع", labelEn: "Factory" },
    { value: "shop", labelAr: "محل", labelEn: "Shop" },
    { value: "restaurant", labelAr: "مطعم", labelEn: "Restaurant" },
    { value: "clinic", labelAr: "عيادة", labelEn: "Clinic" },
    { value: "office", labelAr: "مكتب خدمات", labelEn: "Service Office" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.cityId) {
      setError(isAr ? "اختر المدينة" : "Please select a city");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? (isAr ? "حصل خطأ، حاول تاني" : "Something went wrong"));
      return;
    }

    router.push("/business/new/submitted");
  }

  const label = {
    nameAr: isAr ? "اسم الشركة بالعربي" : "Business name (Arabic)",
    nameEn: isAr ? "اسم الشركة بالإنجليزي" : "Business name (English)",
    type: isAr ? "نوع النشاط" : "Business type",
    descriptionAr: isAr ? "الوصف بالعربي" : "Description (Arabic)",
    descriptionEn: isAr ? "الوصف بالإنجليزي" : "Description (English)",
    country: isAr ? "الدولة" : "Country",
    city: isAr ? "المدينة" : "City",
    category: isAr ? "التصنيف" : "Category",
    phone: isAr ? "الهاتف" : "Phone",
    whatsapp: isAr ? "واتساب" : "WhatsApp",
    submit: isAr ? "إرسال للمراجعة" : "Submit for review",
    submitting: isAr ? "جاري الإرسال..." : "Submitting...",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-sand-light p-8">
      {error && (
        <p className="rounded-lg bg-copper/10 px-4 py-3 text-sm text-copper-dark">{error}</p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label={label.nameAr}>
          <input
            required
            dir="rtl"
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            className="input"
          />
        </Field>
        <Field label={label.nameEn}>
          <input
            required
            dir="ltr"
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            className="input"
          />
        </Field>
      </div>

      <Field label={label.type}>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="input"
        >
          {businessTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {isAr ? t.labelAr : t.labelEn}
            </option>
          ))}
        </select>
      </Field>

      <Field label={label.category}>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="input"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label={label.country}>
          <select
            value={form.countryId}
            onChange={(e) => setForm({ ...form, countryId: e.target.value, cityId: "" })}
            className="input"
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={label.city}>
          <select
            required
            value={form.cityId}
            onChange={(e) => setForm({ ...form, cityId: e.target.value })}
            className="input"
          >
            <option value="" disabled>
              {isAr ? "اختر المدينة" : "Select a city"}
            </option>
            {availableCities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label={label.descriptionAr}>
          <textarea
            dir="rtl"
            rows={3}
            value={form.descriptionAr}
            onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
            className="input"
          />
        </Field>
        <Field label={label.descriptionEn}>
          <textarea
            dir="ltr"
            rows={3}
            value={form.descriptionEn}
            onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label={label.phone}>
          <input
            dir="ltr"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
            placeholder="+971 5x xxx xxxx"
          />
        </Field>
        <Field label={label.whatsapp}>
          <input
            dir="ltr"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="input"
            placeholder="+971 5x xxx xxxx"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-ink py-3.5 font-medium text-sand hover:bg-ink-light transition-colors disabled:opacity-50"
      >
        {loading ? label.submitting : label.submit}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(20, 33, 61, 0.2);
          background: white;
          padding: 0.625rem 1rem;
          color: #22262b;
        }
        .input:focus {
          outline: none;
          border-color: #b5652f;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
