"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { cn, shadowDepthPrimary } from "./utils";

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-glass/50 relative flex h-max">
      <button
        onClick={() => setSidebarOpen(true)}
        className={cn(
          "z-50 flex h-16 w-16 items-center justify-center rounded-full",
          "bg-glass/20 border-primary/10 border-2 backdrop-blur-[6px]",
          shadowDepthPrimary,
          "translate-z-0 transition-opacity duration-300 ease-in-out will-change-[opacity]",
          "fixed bottom-2 left-2 sm:top-[161px] sm:bottom-auto sm:left-[34px]",
          sidebarOpen ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <div className="space-y-1">
          <span className="bg-primary block h-0.5 w-6"></span>
          <span className="bg-primary block h-0.5 w-6"></span>
          <span className="bg-primary block h-0.5 w-6"></span>
        </div>
      </button>

      <div
        className={cn(
          "fixed left-0 z-50 origin-[30px_calc(100%-30px)] transition-transform duration-300 ease-in-out sm:origin-[64px_64px]",
          "bottom-2 sm:top-32 sm:bottom-auto",
          sidebarOpen
            ? "pointer-events-auto visible scale-100"
            : "pointer-events-none scale-0",
        )}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="h-max w-full flex-1">{children}</main>
    </div>
  );
}
