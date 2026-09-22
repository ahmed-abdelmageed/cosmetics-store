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
      <h1 className="text-2xl font-bold mb-6 text-center">{t("loginTitle")}</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">{t("email")}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("password")}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Spinner size={16} />}
          {loading ? t("loggingIn") : t("loginButton")}
        </button>
        <p className="text-sm text-center">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-amber-600 font-medium">
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
