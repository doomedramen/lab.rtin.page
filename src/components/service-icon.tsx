"use client";

import { useState } from "react";

export function ServiceIcon({
  src,
  title,
}: {
  src: string | null;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const initials = title.slice(0, 2).toUpperCase();

  return (
    <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-neutral-50 dark:border-white/10 dark:bg-neutral-800">
      <span
        className={`font-mono text-sm font-semibold text-neutral-600 transition-opacity dark:text-neutral-300 ${
          loaded && !failed ? "opacity-0" : "opacity-100"
        }`}
      >
        {initials}
      </span>
      {src && !failed ? (
        // selfh.st icons are remote SVGs/PNGs; plain img avoids remote Next image config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className={`absolute inset-2 size-8 object-contain transition-opacity ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}
