import type { Service, ServiceManifest } from "@/lib/services";
import { serviceKey } from "@/lib/services";

export type ServiceHealth = {
  key: string;
  state: "online" | "degraded" | "offline" | "unknown";
  label: string;
  status?: number;
  checkedAt: string;
  latencyMs?: number;
};

function expectedStatusMatches(
  expectedStatus: Service["expectedStatus"],
  status: number
) {
  if (typeof expectedStatus === "number") return status === expectedStatus;
  if (Array.isArray(expectedStatus)) return expectedStatus.includes(status);
  return status < 500;
}

export async function checkServiceHealth(
  service: Service,
  defaultTimeoutMs: number
): Promise<ServiceHealth> {
  const checkedAt = new Date().toISOString();

  if (!service.healthUrl) {
    return {
      key: serviceKey(service),
      state: "unknown",
      label: "No health URL",
      checkedAt,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    service.timeoutMs ?? defaultTimeoutMs
  );
  const started = Date.now();

  try {
    const response = await fetch(service.healthUrl, {
      method: service.healthMethod,
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
    });
    const latencyMs = Date.now() - started;
    const matches = expectedStatusMatches(service.expectedStatus, response.status);

    if (matches) {
      return {
        key: serviceKey(service),
        state: "online",
        label: `${response.status} in ${latencyMs}ms`,
        status: response.status,
        checkedAt,
        latencyMs,
      };
    }

    return {
      key: serviceKey(service),
      state: response.status >= 500 ? "degraded" : "offline",
      label: `Unexpected ${response.status}`,
      status: response.status,
      checkedAt,
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - started;
    const timedOut = (error as Error).name === "AbortError";

    return {
      key: serviceKey(service),
      state: "offline",
      label: timedOut ? `Timeout after ${latencyMs}ms` : "No response",
      checkedAt,
      latencyMs,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkAllServices(manifest: ServiceManifest) {
  const results = await Promise.all(
    manifest.services.map((service) =>
      checkServiceHealth(service, manifest.healthTimeoutMs)
    )
  );

  return Object.fromEntries(results.map((result) => [result.key, result]));
}

export function summarizeHealth(statuses: Record<string, ServiceHealth>) {
  return Object.values(statuses).reduce(
    (summary, status) => {
      summary[status.state] += 1;
      return summary;
    },
    { online: 0, degraded: 0, offline: 0, unknown: 0 }
  );
}
