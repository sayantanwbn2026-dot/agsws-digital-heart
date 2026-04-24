import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2, RefreshCw, Activity } from "lucide-react";

type Status = "checking" | "ok" | "fail";
type Check = { id: string; label: string; group: "Database" | "Edge Functions"; status: Status; detail?: string; ms?: number };

const TABLES = [
  "cms_hero", "cms_sections", "cms_stats", "cms_initiatives", "cms_partners",
  "cms_testimonials", "cms_blog_posts", "cms_events", "cms_faqs", "cms_gallery",
  "cms_resources", "cms_site_settings", "cms_team", "cms_stories",
] as const;

const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const APIKEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function pingTable(name: string): Promise<Omit<Check, "id" | "label" | "group">> {
  const t0 = performance.now();
  try {
    const { error } = await (supabase as any).from(name).select("*", { head: true, count: "exact" }).limit(1);
    const ms = Math.round(performance.now() - t0);
    if (error) return { status: "fail", detail: error.message, ms };
    return { status: "ok", ms };
  } catch (e: any) {
    return { status: "fail", detail: e?.message || "Network error", ms: Math.round(performance.now() - t0) };
  }
}

async function pingFn(path: string): Promise<Omit<Check, "id" | "label" | "group">> {
  const t0 = performance.now();
  try {
    const res = await fetch(`${FN_BASE}${path}`, { headers: { apikey: APIKEY, Authorization: `Bearer ${APIKEY}` } });
    const ms = Math.round(performance.now() - t0);
    // 2xx, 4xx (validation/not-found) are still "function reachable". 5xx is fail.
    if (res.status >= 500) return { status: "fail", detail: `HTTP ${res.status}`, ms };
    return { status: "ok", ms };
  } catch (e: any) {
    return { status: "fail", detail: e?.message || "Network error", ms: Math.round(performance.now() - t0) };
  }
}

const SystemHealth = () => {
  useSEO("System Health · AGSWS", "Live status of database tables and edge functions used by the website.");
  const [checks, setChecks] = useState<Check[]>([]);
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const initial: Check[] = [
    ...TABLES.map((t) => ({ id: `tbl:${t}`, label: t, group: "Database" as const, status: "checking" as const })),
    { id: "fn:cms-api", label: "cms-api (CMS read)", group: "Edge Functions", status: "checking" },
    { id: "fn:data-api/donor-wall", label: "data-api · donor-wall", group: "Edge Functions", status: "checking" },
    { id: "fn:data-api/track-donation", label: "data-api · track-donation", group: "Edge Functions", status: "checking" },
    { id: "fn:data-api/track-registration", label: "data-api · track-registration", group: "Edge Functions", status: "checking" },
    { id: "fn:send-email", label: "send-email", group: "Edge Functions", status: "checking" },
    { id: "fn:create-stripe-donation", label: "create-stripe-donation", group: "Edge Functions", status: "checking" },
  ];

  const runAll = async () => {
    setRunning(true);
    setChecks(initial);
    const updates = await Promise.all([
      ...TABLES.map(async (t) => ({ id: `tbl:${t}`, label: t, group: "Database" as const, ...(await pingTable(t)) })),
      pingFn("/cms-api?table=cms_hero").then((r) => ({ id: "fn:cms-api", label: "cms-api (CMS read)", group: "Edge Functions" as const, ...r })),
      pingFn("/data-api/donor-wall?limit=1").then((r) => ({ id: "fn:data-api/donor-wall", label: "data-api · donor-wall", group: "Edge Functions" as const, ...r })),
      pingFn("/data-api/track-donation?payment_id=__health__").then((r) => ({ id: "fn:data-api/track-donation", label: "data-api · track-donation", group: "Edge Functions" as const, ...r })),
      pingFn("/data-api/track-registration?id=__health__").then((r) => ({ id: "fn:data-api/track-registration", label: "data-api · track-registration", group: "Edge Functions" as const, ...r })),
      pingFn("/send-email").then((r) => ({ id: "fn:send-email", label: "send-email", group: "Edge Functions" as const, ...r })),
      pingFn("/create-stripe-donation").then((r) => ({ id: "fn:create-stripe-donation", label: "create-stripe-donation", group: "Edge Functions" as const, ...r })),
    ]);
    setChecks(updates as Check[]);
    setLastRun(new Date());
    setRunning(false);
  };

  useEffect(() => { runAll(); }, []);

  const groups: Check["group"][] = ["Database", "Edge Functions"];
  const totals = checks.reduce(
    (acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; },
    {} as Record<Status, number>,
  );
  const allOk = checks.length > 0 && (totals.ok || 0) === checks.length;

  return (
    <main id="main-content">
      <section className="h-[260px] bg-gradient-to-br from-teal-dark via-teal to-teal flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground text-[11px] uppercase tracking-[0.18em] font-semibold mb-3">
            <Activity size={12} /> Live Status
          </div>
          <h1 className="heading-1 text-primary-foreground">System Health</h1>
          <p className="text-sm text-primary-foreground/70 mt-2 max-w-md mx-auto">
            Checks every database table and edge function the website depends on.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-text-light">Overall</p>
              <p className={`mt-1 text-2xl font-bold ${allOk ? "text-emerald-600" : (totals.fail ? "text-red-600" : "text-text-dark")}`}>
                {running ? "Checking…" : allOk ? "All systems operational" : `${totals.fail || 0} issue${(totals.fail || 0) === 1 ? "" : "s"} detected`}
              </p>
              {lastRun && <p className="text-[11px] text-text-light mt-1">Last checked {lastRun.toLocaleTimeString()}</p>}
            </div>
            <button onClick={runAll} disabled={running} className="h-10 px-4 bg-teal text-primary-foreground font-semibold rounded-lg flex items-center gap-2 disabled:opacity-60 hover:bg-teal-dark transition-colors">
              {running ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Re-check
            </button>
          </div>

          {groups.map((g) => {
            const rows = checks.filter((c) => c.group === g);
            return (
              <div key={g} className="global-card mb-6">
                <h2 className="text-sm font-bold text-text-dark mb-4">{g}</h2>
                <div className="divide-y divide-border">
                  {rows.map((c) => (
                    <div key={c.id} className="flex items-center justify-between py-3 gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-dark truncate">{c.label}</p>
                        {c.detail && <p className="text-xs text-red-600 mt-0.5 truncate">{c.detail}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {typeof c.ms === "number" && <span className="text-[11px] text-text-light tabular-nums">{c.ms}ms</span>}
                        {c.status === "checking" && <Loader2 size={16} className="text-text-light animate-spin" />}
                        {c.status === "ok" && <CheckCircle2 size={16} className="text-emerald-600" />}
                        {c.status === "fail" && <XCircle size={16} className="text-red-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <p className="text-[11px] text-text-light text-center mt-8">
            This page is safe to share with technical partners. It does not expose any private data.
          </p>
        </div>
      </section>
    </main>
  );
};

export default SystemHealth;