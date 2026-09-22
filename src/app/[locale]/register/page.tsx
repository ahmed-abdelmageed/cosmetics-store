"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import toast from "react-hot-toast";
import Spinner from "@/components/spinner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const t = useTranslations("auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Something went wrong");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    toast.success(t("registerSuccess"));
    router.push("/");
    router.refresh();
  };

  return (
    <div className="container-app py-16 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("registerTitle")}</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">{t("fullName")}</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("email")}</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("phoneOptional")}</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("password")}</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Spinner size={16} />}
          {loading ? t("registering") : t("registerButton")}
        </button>
        <p className="text-sm text-center">
          {t("haveAccount")}{" "}
          <Link href="/login" className="text-amber-600 font-medium">
            {t("loginTitle")}
          </Link>
        </p>
      </form>
    </div>
  );
}
