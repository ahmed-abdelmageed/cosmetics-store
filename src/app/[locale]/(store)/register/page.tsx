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
      <h1 className="font-display text-3xl mb-8 text-center">{t("registerTitle")}</h1>
      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5">
        <div>
          <label className="label">{t("fullName")}</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="label">{t("email")}</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="label">{t("phoneOptional")}</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="label">{t("password")}</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="field"
          />
        </div>
        <button
          disabled={loading}
          className="btn-primary w-full py-3.5"
        >
          {loading && <Spinner size={16} />}
          {loading ? t("registering") : t("registerButton")}
        </button>
        <p className="text-sm text-center">
          {t("haveAccount")}{" "}
          <Link href="/login" className="text-ink font-medium underline underline-offset-4">
            {t("loginTitle")}
          </Link>
        </p>
      </form>
    </div>
  );
}
