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
      className="grid grid-cols-3 rounded-lg border border-black/10 bg-neutral-100 p-1 dark:border-white/15 dark:bg-neutral-900"
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
              "flex size-8 items-center justify-center rounded-md text-neutral-500 outline-none transition-colors hover:bg-white hover:text-neutral-950 focus-visible:ring-3 focus-visible:ring-neutral-500/30 active:translate-y-px dark:text-neutral-400 dark:hover:bg-black dark:hover:text-white",
              active &&
                "bg-white text-neutral-950 shadow-sm hover:bg-white hover:text-neutral-950 dark:bg-black dark:text-white dark:hover:bg-black dark:hover:text-white"
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
