import { readFile } from "node:fs/promises";
import path from "node:path";

import { parse } from "yaml";
import { z } from "zod";

const serviceSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  icon: z.string().min(1).optional(),
  iconVariant: z.enum(["default", "dark", "light"]).default("default"),
  healthUrl: z.string().url().optional(),
  healthMethod: z.enum(["GET", "HEAD"]).default("GET"),
  expectedStatus: z.union([z.number().int(), z.array(z.number().int())]).optional(),
  timeoutMs: z.number().int().positive().max(15000).optional(),
});

const manifestSchema = z.object({
  title: z.string().min(1).default("lab.rtin.page"),
  description: z
    .string()
    .min(1)
    .default("Hosted services, checked from inside the lab."),
  healthTimeoutMs: z.number().int().positive().max(15000).default(2500),
  refreshSeconds: z.number().int().positive().max(3600).default(60),
  services: z.array(serviceSchema).default([]),
});

export type Service = z.infer<typeof serviceSchema>;
export type ServiceManifest = z.infer<typeof manifestSchema>;

export type ManifestResult =
  | { manifest: ServiceManifest; configPath: string; error?: undefined }
  | { manifest: ServiceManifest; configPath: string; error: string };

const emptyManifest: ServiceManifest = {
  title: "lab.rtin.page",
  description: "Hosted services, checked from inside the lab.",
  healthTimeoutMs: 2500,
  refreshSeconds: 60,
  services: [],
};

function configCandidates() {
  const configuredPath = process.env.CONFIG_PATH;
  return [
    configuredPath,
    "/config/services.yaml",
    "/config/services.yml",
    "/config/services.json",
    path.join(process.cwd(), "config/services.yaml"),
    path.join(process.cwd(), "config/services.yml"),
    path.join(process.cwd(), "config/services.json"),
  ].filter(Boolean) as string[];
}

async function readFirstConfig() {
  const failures: string[] = [];

  for (const candidate of configCandidates()) {
    try {
      return {
        configPath: candidate,
        content: await readFile(candidate, "utf8"),
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        failures.push(`${candidate}: ${(error as Error).message}`);
      }
    }
  }

  return {
    configPath: "none",
    content: "",
    error: failures.join("; ") || "No config file found.",
  };
}

export async function loadManifest(): Promise<ManifestResult> {
  const file = await readFirstConfig();

  if ("error" in file) {
    return {
      manifest: emptyManifest,
      configPath: file.configPath,
      error: file.error,
    };
  }

  try {
    const raw = file.configPath.endsWith(".json")
      ? JSON.parse(file.content)
      : parse(file.content);

    return {
      manifest: manifestSchema.parse(raw),
      configPath: file.configPath,
    };
  } catch (error) {
    return {
      manifest: emptyManifest,
      configPath: file.configPath,
      error:
        error instanceof z.ZodError
          ? z.prettifyError(error)
          : (error as Error).message,
    };
  }
}

export function serviceKey(service: Service) {
  return (
    service.id ||
    service.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export function iconUrl(service: Service) {
  if (!service.icon) return null;

  if (service.icon.startsWith("http") || service.icon.startsWith("/")) {
    return service.icon;
  }

  const reference = service.icon
    .replace(/^selfhst:/, "")
    .replace(/^sh:/, "")
    .replace(/^sh-/, "");
  const variant =
    service.iconVariant === "default" ? reference : `${reference}-${service.iconVariant}`;

  return `https://cdn.jsdelivr.net/gh/selfhst/icons/svg/${variant}.svg`;
}
