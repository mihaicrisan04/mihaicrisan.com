"use client";

import { type ComponentType, useEffect, useState } from "react";

// Loads a component chunk after mount. Render a static stand-in until it
// resolves so the HTML already contains the content.
export function useLazyComponent<P>(
  load: () => Promise<ComponentType<P>>
): ComponentType<P> | null {
  const [Component, setComponent] = useState<ComponentType<P> | null>(null);

  useEffect(() => {
    let active = true;
    load().then((loaded) => {
      if (active) {
        setComponent(() => loaded);
      }
    });
    return () => {
      active = false;
    };
  }, [load]);

  return Component;
}
