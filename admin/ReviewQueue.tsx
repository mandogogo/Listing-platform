"use client";

import { useEffect, useState } from "react";

type PendingOrg = {
  id: string;
  name: string;
  description: string;
  type: string;
  city: string;
  country: string;
  phone: string | null;
  email: string | null;
  categories: string[];
  owner: { name: string; email: string } | null;
  createdAt: string;
};

export function ReviewQueue({ locale }: { locale: "ar" | "en" }) {
  const isAr = locale === "ar";
  const [items, setItems] = useState<PendingOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/organizations?status=PENDING_REVIEW");
    const body = await res.json();
    setItems(body.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: string, status: "PUBLISHED" | "REJECTED") {
    setActingId(id);
    await fetch(`/api/organizations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publishStatus: status }),
    });
    setItems((prev) => prev.filter((item) => item.id !== id));
    setActingId(null);
  }

  if (loading) {
    return <p className="text-ink/60">{isAr ? "جاري التحميل..." : "Loading..."}</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-sand-light p-10 text-center">
        <p className="text-ink/60">
          {isAr ? "مفيش طلبات معلّقة دلوقتي" : "No pending submissions right now"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((org) => (
        <div key={org.id} className="rounded-xl bg-sand-light p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex flex-wrap gap-2">
                {org.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-ink/15 px-2.5 py-0.5 font-mono text-xs text-ink/60"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-ink">{org.name}</h3>
              <p className="mt-1 font-mono text-sm text-ink/50">
                {org.city}, {org.country} · {org.type}
              </p>
              {org.description && (
                <p className="mt-2 max-w-xl text-sm text-ink/70">{org.description}</p>
              )}
              <p className="mt-2 text-xs text-ink/50">
                {isAr ? "مقدّم من: " : "Submitted by: "}
                {org.owner?.name} ({org.owner?.email})
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => act(org.id, "REJECTED")}
                disabled={actingId === org.id}
                className="rounded-lg border border-ink/20 px-4 py-2 text-sm font-medium text-ink hover:bg-white transition-colors disabled:opacity-50"
              >
                {isAr ? "رفض" : "Reject"}
              </button>
              <button
                onClick={() => act(org.id, "PUBLISHED")}
                disabled={actingId === org.id}
                className="rounded-lg bg-emerald px-4 py-2 text-sm font-medium text-white hover:bg-emerald-light transition-colors disabled:opacity-50"
              >
                {isAr ? "نشر" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
