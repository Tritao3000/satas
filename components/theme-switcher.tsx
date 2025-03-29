"use client";

import { Switch } from "@/components/ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useId } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const id = useId();

  const isDarkMode = theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="group flex items-center gap-2"
      data-state={isDarkMode ? "checked" : "unchecked"}
    >
      <span
        id={`${id}-off`}
        className="group-data-[state=unchecked]:text-sidebar-foreground group-data-[state=checked]:text-sidebar-foreground/50 flex-1 cursor-pointer text-right text-sm font-medium"
        aria-controls={id}
        onClick={() => setTheme("light")}
      >
        <SunIcon className="size-4" aria-hidden="true" />
      </span>
      <Switch
        className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
        id={id}
        size="sm"
        checked={isDarkMode}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-labelledby={`${id}-off ${id}-on`}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-on`}
        className="group-data-[state=checked]:text-sidebar-foreground group-data-[state=unchecked]:text-sidebar-foreground/50 flex-1 cursor-pointer text-left text-sm font-medium"
        aria-controls={id}
        onClick={() => setTheme("dark")}
      >
        <MoonIcon className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
};

export { ThemeSwitcher };
