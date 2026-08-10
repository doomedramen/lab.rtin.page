"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div
      className="grid grid-cols-3 rounded-lg border border-white/10 bg-white/10 p-1 dark:border-white/10 dark:bg-white/10"
      aria-label="Theme"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = mounted && theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-white/60 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-lime-300/40 active:translate-y-px",
              active && "bg-lime-300 text-neutral-950 hover:bg-lime-300 hover:text-neutral-950"
            )}
            aria-label={`Use ${option.label} theme`}
            aria-pressed={active}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
