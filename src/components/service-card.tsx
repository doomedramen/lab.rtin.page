import { Activity, ArrowUpRight, CircleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ServiceIcon } from "@/components/service-icon";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ServiceHealth } from "@/lib/health";
import type { Service } from "@/lib/services";
import { iconUrl } from "@/lib/services";
import { cn } from "@/lib/utils";

const statusStyles = {
  online:
    "border-black/10 bg-neutral-100 text-neutral-900 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100",
  degraded:
    "border-black/10 bg-neutral-100 text-neutral-900 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100",
  offline:
    "border-black/10 bg-neutral-100 text-neutral-900 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100",
  unknown:
    "border-black/10 bg-neutral-100 text-neutral-600 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-300",
} satisfies Record<ServiceHealth["state"], string>;

const dotStyles = {
  online: "bg-neutral-950 dark:bg-white",
  degraded: "bg-neutral-500",
  offline: "bg-neutral-500",
  unknown: "bg-neutral-400",
} satisfies Record<ServiceHealth["state"], string>;

export function ServiceCard({
  service,
  health,
}: {
  service: Service;
  health?: ServiceHealth;
}) {
  const icon = iconUrl(service);
  const state = health?.state ?? "unknown";

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${service.title}`}
      className="block rounded-lg outline-none transition-transform focus-visible:ring-3 focus-visible:ring-neutral-500/30 active:translate-y-px"
    >
      <Card className="min-h-[172px] rounded-lg border border-black/10 bg-white shadow-none transition-all hover:-translate-y-0.5 hover:border-black/25 dark:border-white/15 dark:bg-black dark:hover:border-white/35">
        <CardHeader className="grid-cols-[1fr_auto] gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <ServiceIcon src={icon} title={service.title} />
            <div className="min-w-0">
              <CardTitle className="truncate text-[1.03rem] font-semibold tracking-normal">
                {service.title}
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2 text-[0.92rem] leading-5">
                {service.description}
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <ArrowUpRight className="size-4 text-neutral-400 transition-colors group-hover/card:text-neutral-950 dark:text-neutral-500 dark:group-hover/card:text-neutral-100" />
          </CardAction>
        </CardHeader>
        <CardContent className="mt-auto flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className={cn(
              "h-7 rounded-md border px-2.5 text-[0.78rem]",
              statusStyles[state]
            )}
          >
            <span className={cn("size-1.5 rounded-full", dotStyles[state])} />
            {state}
          </Badge>
          <span className="flex min-w-0 items-center gap-1.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
            {state === "unknown" ? (
              <CircleAlert className="size-3.5 shrink-0" />
            ) : (
              <Activity className="size-3.5 shrink-0" />
            )}
            <span className="truncate">{health?.label ?? "Not checked"}</span>
          </span>
        </CardContent>
      </Card>
    </a>
  );
}
