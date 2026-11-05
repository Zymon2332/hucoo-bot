import { useEffect, useState } from "react";
import { Toaster } from "@hucoo/ui/components/sonner";

function isDark() {
  return document.documentElement.classList.contains("dark");
}

export function ThemedToaster() {
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDark()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Toaster
      theme={dark ? "dark" : "light"}
      position="bottom-right"
      closeButton
      offset={{ bottom: 92, right: 24 }}
    />
  );
}
