"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import toast from "react-hot-toast";
import Spinner from "@/components/spinner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error(t("invalidCredentials"));
      return;
    }
    toast.success(t("loginSuccess"));
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="container-app py-16 max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-8 text-center">{t("loginTitle")}</h1>
      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5">
        <div>
          <label className="label">{t("email")}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
        </div>
        <div>
          <label className="label">{t("password")}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
          />
        </div>
        <button
          disabled={loading}
          className="btn-primary w-full py-3.5"
        >
          {loading && <Spinner size={16} />}
          {loading ? t("loggingIn") : t("loginButton")}
        </button>
        <p className="text-sm text-center">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-ink font-medium underline underline-offset-4">
            {t("createAccount")}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
