"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "حصل خطأ، حاول تاني");
      setLoading(false);
      return;
    }

    // Auto sign-in right after successful registration
    await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-mono text-lg font-semibold text-ink">السجل</span>
          <h1 className="mt-4 text-2xl font-semibold text-ink">إنشاء حساب</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-sand-light p-8">
          {error && (
            <p className="rounded-lg bg-copper/10 px-4 py-3 text-sm text-copper-dark">{error}</p>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">الاسم</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-ink focus:border-copper focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-ink focus:border-copper focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">كلمة المرور</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-ink focus:border-copper focus:outline-none"
            />
            <p className="mt-1 text-xs text-ink/50">8 أحرف على الأقل</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-ink py-3 font-medium text-sand hover:bg-ink-light transition-colors disabled:opacity-50"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          عندك حساب بالفعل؟{" "}
          <Link href="/login" className="font-medium text-copper hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  );
}
