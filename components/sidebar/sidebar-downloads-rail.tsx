"use client";

import * as React from "react";
import {
  Archive,
  CircleArrowDown,
  Images,
  Paintbrush,
  PanelsTopLeft,
  Presentation,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { SIDEBAR_LEFT_RAIL_WIDTH_PX, useSidebar } from "./sidebar";

const dockEase = [0.22, 1, 0.36, 1] as const;

const librarySections = [
  { label: "Media", icon: Images },
  { label: "Downloads", icon: CircleArrowDown },
  { label: "Easels", icon: Presentation },
  { label: "Spaces", icon: PanelsTopLeft },
  { label: "Boosts", icon: Paintbrush },
  { label: "Archived Tabs", icon: Archive },
] as const;

type LibrarySection = (typeof librarySections)[number]["label"];

/** Library navigation beside the main sidebar, opened by its existing trigger. */
export function SidebarDownloadsRail({ className }: { className?: string }) {
  const { downloadsRailOpen, toggleDownloadsRail, leftRailWidthPx, isMobile } = useSidebar();
  const [activeSection, setActiveSection] = React.useState<LibrarySection>("Spaces");
  const reduceMotion = useReducedMotion();

  if (isMobile) return null;

  const isOpen = downloadsRailOpen && leftRailWidthPx > 0;
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: dockEase };

  return (
    <motion.div
      data-slot="sidebar-downloads-rail"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn("relative isolate z-20 shrink-0 max-md:hidden", className)}
      initial={false}
      animate={{ width: leftRailWidthPx }}
      transition={transition}
    >
      <div className="relative z-10 h-full overflow-hidden">
        <motion.nav
          aria-label="Library"
          className="relative flex h-svh flex-col border-r border-black/10 bg-sidebar px-1.5 py-12"
          style={{ width: SIDEBAR_LEFT_RAIL_WIDTH_PX }}
          initial={false}
          animate={{ x: isOpen ? 0 : -SIDEBAR_LEFT_RAIL_WIDTH_PX }}
          transition={transition}
        >
          <button
            type="button"
            aria-label="Close secondary sidebar"
            onClick={toggleDownloadsRail}
            className="absolute top-3 right-2 flex size-7 items-center justify-center rounded-md text-black/65 outline-none hover:bg-black/10 hover:text-black focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
          <ul className="flex min-h-0 flex-1 flex-col justify-around gap-3 overflow-y-auto">
            {librarySections.map(({ label, icon: Icon }) => (
              <li key={label} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={activeSection === label}
                  onClick={() => setActiveSection(label)}
                  className="group flex min-h-16 w-full flex-col items-center justify-center gap-2 rounded-md px-0.5 py-2 font-medium text-black/65 outline-none transition-colors duration-150 hover:bg-black/6 hover:text-black/85 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-inset aria-pressed:bg-black/8 aria-pressed:text-black/90"
                >
                  <Icon className="size-6 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span className="w-full whitespace-nowrap text-center text-[11px] leading-4 tracking-[-0.01em]">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.nav>
      </div>
      <motion.div
        data-slot="sidebar-library-panel"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-full z-0 h-svh w-(--sidebar-width) bg-sidebar"
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={transition}
      />
    </motion.div>
  );
}
