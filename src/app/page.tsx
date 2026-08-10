import { Cloud, RefreshCw, ShieldCheck, Terminal } from "lucide-react";

import { AutoRefresh } from "@/components/auto-refresh";
import { ServiceCard } from "@/components/service-card";
import { Badge } from "@/components/ui/badge";
import { checkAllServices, summarizeHealth } from "@/lib/health";
import { loadManifest, serviceKey } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await loadManifest();
  const statuses = await checkAllServices(result.manifest);
  const summary = summarizeHealth(statuses);
  const checkedAt = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="min-h-dvh bg-[#f6f7ef] text-neutral-950">
      <AutoRefresh seconds={result.manifest.refreshSeconds} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 rounded-lg border border-black/10 bg-[#10120f] px-5 py-5 text-white shadow-[0_18px_80px_rgba(16,18,15,0.18)] sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-lime-300 text-neutral-950">
                <Terminal className="size-5" />
              </div>
              <div>
                <p className="text-sm text-white/55">Cloudflare protected</p>
                <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
                  {result.manifest.title}
                </h1>
              </div>
            </div>
            <Badge className="hidden h-8 rounded-md bg-white/10 px-3 text-white sm:inline-flex">
              <ShieldCheck className="size-3.5" />
              Access
            </Badge>
          </div>

          <div className="grid gap-4 border-t border-white/10 pt-5 md:grid-cols-[1.4fr_1fr] md:items-end">
            <p className="max-w-2xl text-balance text-base leading-6 text-white/72">
              {result.manifest.description}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:justify-self-end">
              <Metric label="online" value={summary.online} />
              <Metric label="offline" value={summary.offline} />
              <Metric label="unknown" value={summary.unknown} />
              <Metric label="total" value={result.manifest.services.length} />
            </div>
          </div>
        </header>

        {result.error ? (
          <section className="rounded-lg border border-rose-900/20 bg-rose-50 p-4 text-sm text-rose-950">
            <p className="font-semibold">Config problem</p>
            <p className="mt-1 whitespace-pre-wrap text-rose-900/80">
              {result.error}
            </p>
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-lg font-semibold tracking-normal">Services</h2>
              <p className="max-w-full truncate text-sm text-neutral-600">
                Checked at {checkedAt}
                <span className="hidden sm:inline">
                  {" "}
                  from <code>{result.configPath}</code>
                </span>
                .
              </p>
            </div>
            <Badge
              variant="outline"
              className="h-8 w-fit rounded-md border-black/10 bg-white px-3 text-neutral-700"
            >
              <RefreshCw className="size-3.5" />
              refreshes every {result.manifest.refreshSeconds}s
            </Badge>
          </div>

          {result.manifest.services.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.manifest.services.map((service) => (
                <ServiceCard
                  key={serviceKey(service)}
                  service={service}
                  health={statuses[serviceKey(service)]}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-black/20 bg-white/70 p-8 text-center">
              <Cloud className="mx-auto size-8 text-neutral-400" />
              <h2 className="mt-4 text-lg font-semibold">No services yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
                Mount a config file at <code>/config/services.yaml</code> to
                publish service cards.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2">
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-white/55">{label}</div>
    </div>
  );
}
