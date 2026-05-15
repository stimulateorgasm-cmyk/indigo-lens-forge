import { useEffect, useMemo, useState } from "react";
import {
  createFileRoute,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LogOut, RefreshCw, Download, Search } from "lucide-react";
import { getAdminStats, getAdminLeads, logoutAdmin, verifyAdminSession } from "@/lib/admin.functions";
import { ADMIN_KEY_STORAGE } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster, toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Аналитика — Indigo Lab" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const verifySession = useServerFn(verifyAdminSession);

  useEffect(() => {
    if (typeof window === "undefined") return;
    verifySession({ data: undefined })
      .then(() => setReady(true))
      .catch(() => {
        window.sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        navigate({ to: "/login" });
      });
  }, [navigate, verifySession]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Загрузка…</div>
      </main>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const fetchStats = useServerFn(getAdminStats);
  const fetchLeads = useServerFn(getAdminLeads);
  const logout = useServerFn(logoutAdmin);
  const navigate = useNavigate();

  const [variant, setVariant] = useState<"all" | "top" | "bottom">("all");
  const [utmSource, setUtmSource] = useState("all");
  const [search, setSearch] = useState("");

  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetchStats({ data: undefined }),
  });

  const leads = useQuery({
    queryKey: ["admin-leads", variant, utmSource, search],
    queryFn: () =>
      fetchLeads({
        data: {
          variant: variant === "all" ? null : variant,
          utm_source: utmSource === "all" ? null : utmSource,
          search: search || null,
          limit: 200,
        },
      }),
  });

  const onLogout = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    }
    logout({ data: undefined }).catch(() => undefined);
    navigate({ to: "/login" });
  };

  const refresh = () => {
    stats.refetch();
    leads.refetch();
  };

  const onExport = () => {
    const rows = leads.data?.leads ?? [];
    if (!rows.length) {
      toast.info("Нет данных для экспорта");
      return;
    }
    const headers = [
      "created_at",
      "name",
      "contact",
      "variant",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "referrer",
      "landing_path",
    ];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = (r as Record<string, unknown>)[h];
            const s = v == null ? "" : String(v);
            return `"${s.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `indigo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sourceOptions = useMemo(() => {
    const set = new Set<string>();
    for (const s of stats.data?.sources ?? []) set.add(s.source);
    return Array.from(set);
  }, [stats.data]);

  const t = stats.data?.totals;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link to="/" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Indigo Lab
            </Link>
            <h1 className="text-lg font-semibold">Аналитика</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={refresh}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Обновить
            </Button>
            <Button size="sm" variant="ghost" onClick={onLogout}>
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {stats.isError && (
          <Card>
            <CardContent className="flex items-center justify-between py-6 text-sm text-destructive">
              <span>Сессия истекла или пароль изменён. Войдите заново.</span>
              <Button size="sm" variant="outline" onClick={onLogout}>
                На вход
              </Button>
            </CardContent>
          </Card>
        )}

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Заявки за 30 дней" value={t?.leads30 ?? "—"} hint={`${t?.leads7 ?? 0} за 7 дней`} />
          <KpiCard label="Уникальные сессии (30д)" value={t?.uniqueSessions30 ?? "—"} hint={`${t?.visits30 ?? 0} визитов всего`} />
          <KpiCard label="Конверсия в заявку" value={t ? `${t.conversion}%` : "—"} hint="заявки / уник. сессии" />
          <KpiCard label="Всего в базе" value={t?.leads ?? "—"} hint={`${t?.visits ?? 0} визитов всего`} />
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Заявки и визиты, последние 30 дней</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.data?.daily ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(d: string) => d.slice(5)} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Визиты" />
                  <Line type="monotone" dataKey="leads" stroke="#ec4899" strokeWidth={2} dot={false} name="Заявки" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Источники трафика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(stats.data?.sources ?? []).slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="source" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="visits" fill="#8b5cf6" name="Визиты" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="leads" fill="#ec4899" name="Заявки" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Funnel + variant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Воронка и формы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FunnelRow label="Уникальные сессии" value={t?.uniqueSessions30 ?? 0} max={t?.uniqueSessions30 ?? 0} color="#8b5cf6" />
              <FunnelRow label="Визиты страницы" value={t?.visits30 ?? 0} max={t?.uniqueSessions30 ?? 0} color="#a78bfa" />
              <FunnelRow label="Заявки" value={t?.leads30 ?? 0} max={t?.uniqueSessions30 ?? 0} color="#ec4899" />
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div>
                  <div className="text-xs text-muted-foreground">Форма сверху</div>
                  <div className="text-2xl font-semibold">{stats.data?.variants.top ?? 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Форма снизу</div>
                  <div className="text-2xl font-semibold">{stats.data?.variants.bottom ?? 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads table */}
        <Card>
          <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-base">Заявки</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Имя или контакт"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-56 pl-8"
                />
              </div>
              <Select value={variant} onValueChange={(v) => setVariant(v as "all" | "top" | "bottom")}>
                <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все формы</SelectItem>
                  <SelectItem value="top">Сверху</SelectItem>
                  <SelectItem value="bottom">Снизу</SelectItem>
                </SelectContent>
              </Select>
              <Select value={utmSource} onValueChange={setUtmSource}>
                <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все источники</SelectItem>
                  {sourceOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={onExport}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Контакт</TableHead>
                    <TableHead>Форма</TableHead>
                    <TableHead>UTM</TableHead>
                    <TableHead>Реферер</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(leads.data?.leads ?? []).map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(l.created_at).toLocaleString("ru-RU", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{l.name}</TableCell>
                      <TableCell className="text-sm">{l.contact}</TableCell>
                      <TableCell>
                        {l.variant && <Badge variant="secondary">{l.variant}</Badge>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {[l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(" / ") || "—"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                        {l.referrer ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {leads.data && leads.data.leads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                        Заявок пока нет
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster theme="dark" position="bottom-center" />
    </main>
  );
}

function KpiCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-2 text-3xl font-semibold">{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function FunnelRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}