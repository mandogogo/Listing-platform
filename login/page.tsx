"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-mono text-lg font-semibold text-ink">السجل</span>
          <h1 className="mt-4 text-2xl font-semibold text-ink">تسجيل الدخول</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-sand-light p-8">
          {error && (
            <p className="rounded-lg bg-copper/10 px-4 py-3 text-sm text-copper-dark">{error}</p>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-ink focus:border-copper focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-ink focus:border-copper focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-ink py-3 font-medium text-sand hover:bg-ink-light transition-colors disabled:opacity-50"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          مالكش حساب؟{" "}
          <Link href="/register" className="font-medium text-copper hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </main>
  );
}
