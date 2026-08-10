"use client";

import { useEffect } from "react";

export function AutoRefresh({ seconds }: { seconds: number }) {
  useEffect(() => {
    const timer = window.setTimeout(() => window.location.reload(), seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  return null;
}
