import { Cloud, RefreshCw, ShieldCheck, Terminal } from "lucide-react";

import { AutoRefresh } from "@/components/auto-refresh";
import { ServiceCard } from "@/components/service-card";
import { ThemeToggle } from "@/components/theme-toggle";
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
    <main className="min-h-dvh bg-white text-neutral-950 dark:bg-black dark:text-neutral-50">
      <AutoRefresh seconds={result.manifest.refreshSeconds} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 rounded-lg border border-black/10 bg-white px-5 py-5 text-neutral-950 shadow-none dark:border-white/15 dark:bg-black dark:text-white sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-black/10 bg-neutral-100 text-neutral-950 dark:border-white/15 dark:bg-neutral-900 dark:text-white">
                <Terminal className="size-5" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Cloudflare protected
                </p>
                <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
                  {result.manifest.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="hidden h-8 rounded-md border-black/10 bg-white px-3 text-neutral-700 dark:border-white/15 dark:bg-black dark:text-neutral-300 sm:inline-flex"
              >
                <ShieldCheck className="size-3.5" />
                Access
              </Badge>
              <ThemeToggle />
            </div>
          </div>

          <div className="grid gap-4 border-t border-black/10 pt-5 dark:border-white/15 md:grid-cols-[1.4fr_1fr] md:items-end">
            <p className="max-w-2xl text-balance text-base leading-6 text-neutral-600 dark:text-neutral-300">
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
          <section className="rounded-lg border border-black/10 bg-neutral-50 p-4 text-sm text-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50">
            <p className="font-semibold">Config problem</p>
            <p className="mt-1 whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">
              {result.error}
            </p>
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-lg font-semibold tracking-normal">Services</h2>
              <p className="max-w-full truncate text-sm text-neutral-600 dark:text-neutral-400">
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
              className="h-8 w-fit rounded-md border-black/10 bg-white px-3 text-neutral-700 dark:border-white/15 dark:bg-black dark:text-neutral-300"
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
            <div className="rounded-lg border border-dashed border-black/20 bg-white p-8 text-center dark:border-white/20 dark:bg-black">
              <Cloud className="mx-auto size-8 text-neutral-400 dark:text-neutral-500" />
              <h2 className="mt-4 text-lg font-semibold">No services yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-400">
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
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/15 dark:bg-black">
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
    </div>
  );
}
