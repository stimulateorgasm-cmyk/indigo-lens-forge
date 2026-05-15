import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { ADMIN_KEY_STORAGE } from "@/lib/admin-auth";
import { getAdminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Вход — Indigo Lab" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const verify = useServerFn(getAdminStats);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const key = url.searchParams.get("key");
    if (key) {
      window.sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
      url.searchParams.delete("key");
      window.history.replaceState({}, "", url.toString());
      navigate({ to: "/admin" });
      return;
    }
    if (window.sessionStorage.getItem(ADMIN_KEY_STORAGE)) {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setBusy(true);
    window.sessionStorage.setItem(ADMIN_KEY_STORAGE, password);
    try {
      await verify({ data: undefined });
      navigate({ to: "/admin" });
    } catch {
      window.sessionStorage.removeItem(ADMIN_KEY_STORAGE);
      toast.error("Неверный пароль");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-6 text-center">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Indigo Lab
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            Вход в админку
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Проверяем…" : "Войти"}
          </Button>
        </form>
      </div>
      <Toaster theme="dark" position="bottom-center" />
    </main>
  );
}