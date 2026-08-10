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
  online: "border-emerald-700/15 bg-emerald-50 text-emerald-800",
  degraded: "border-amber-700/15 bg-amber-50 text-amber-800",
  offline: "border-rose-700/15 bg-rose-50 text-rose-800",
  unknown: "border-neutral-300 bg-neutral-100 text-neutral-600",
} satisfies Record<ServiceHealth["state"], string>;

const dotStyles = {
  online: "bg-emerald-500",
  degraded: "bg-amber-500",
  offline: "bg-rose-500",
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
      className="block rounded-lg outline-none transition-transform focus-visible:ring-3 focus-visible:ring-lime-500/40 active:translate-y-px"
    >
      <Card className="min-h-[172px] rounded-lg border border-black/10 bg-white/90 shadow-[0_16px_50px_rgba(20,20,16,0.07)] transition-all hover:-translate-y-0.5 hover:border-lime-700/30 hover:shadow-[0_18px_60px_rgba(20,20,16,0.12)]">
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
            <ArrowUpRight className="size-4 text-neutral-400 transition-colors group-hover/card:text-neutral-950" />
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
          <span className="flex min-w-0 items-center gap-1.5 truncate text-xs text-neutral-500">
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
