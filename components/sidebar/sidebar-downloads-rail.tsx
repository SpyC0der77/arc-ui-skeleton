"use client";

import * as React from "react";
import { Gift, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloads } from "./downloads-data";
import {
  NudgeIcon,
  playNudgeOnPress,
  type IconNudgePreset,
  type NudgeIconHandle,
} from "./nudge-icon";
import { SIDEBAR_LEFT_RAIL_WIDTH_PX, useSidebar } from "./sidebar";

const dockEase = [0.22, 1, 0.36, 1] as const;

function DownloadRailItem({
  shortMeta,
  icon: Icon,
  nudge,
  progress,
  isOpen,
}: {
  shortMeta: string;
  icon: (props: { className?: string }) => React.ReactNode;
  nudge: IconNudgePreset;
  progress?: number;
  isOpen: boolean;
}) {
  const iconRef = React.useRef<NudgeIconHandle>(null);

  return (
    <li className="w-full">
      <button
        type="button"
        tabIndex={isOpen ? undefined : -1}
        className="flex w-full flex-col items-center gap-1 rounded-lg px-1.5 py-2 outline-none hover:bg-black/6 focus-visible:bg-black/6"
        onPointerDown={playNudgeOnPress(iconRef)}
      >
        <span className="flex size-8 items-center justify-center rounded-md border border-black/10 bg-white/70 text-black/60">
          <NudgeIcon ref={iconRef} preset={nudge}>
            <Icon className="size-4" />
          </NudgeIcon>
        </span>
        <span className="w-full truncate text-center text-[10px] text-black/45">
          {shortMeta}
        </span>
        {progress != null && (
          <span className="mt-0.5 block h-0.75 w-8 overflow-hidden rounded-full bg-black/10">
            <span
              className="block h-full rounded-full bg-black/40"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </span>
        )}
      </button>
    </li>
  );
}

/**
 * Narrow rail docked to the left of the sidebar, toggled by the downloads button.
 * Stays in normal flow so opening it pushes the sidebar gap and the page inset right.
 */
export function SidebarDownloadsRail({ className }: { className?: string }) {
  const { downloadsRailOpen, toggleDownloadsRail, leftRailWidthPx, isMobile } =
    useSidebar();
  const reduceMotion = useReducedMotion();
  const giftRef = React.useRef<NudgeIconHandle>(null);
  const closeRef = React.useRef<NudgeIconHandle>(null);

  if (isMobile) return null;

  const isOpen = downloadsRailOpen && leftRailWidthPx > 0;
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: dockEase };

  return (
    <motion.div
      data-slot="sidebar-downloads-rail"
      aria-hidden={!isOpen}
      className={cn(
        "relative z-20 shrink-0 overflow-hidden max-md:hidden",
        className,
      )}
      initial={false}
      animate={{ width: leftRailWidthPx }}
      transition={transition}
    >
      <motion.div
        className="flex h-svh flex-col items-stretch gap-2 border-r border-black/10 px-1.5 py-4"
        style={{ width: SIDEBAR_LEFT_RAIL_WIDTH_PX }}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -12 }}
        transition={transition}
      >
        <div className="flex w-full items-center justify-center gap-1.5">
          <span
            className="inline-flex text-black/45"
            onPointerDown={playNudgeOnPress(giftRef)}
          >
            <NudgeIcon ref={giftRef} preset="gift">
              <Gift className="size-4" aria-hidden />
            </NudgeIcon>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Close downloads"
            className="rounded-md text-black/45 hover:bg-black/10 hover:text-black"
            onClick={toggleDownloadsRail}
            onPointerDown={playNudgeOnPress(closeRef)}
            tabIndex={isOpen ? undefined : -1}
          >
            <NudgeIcon ref={closeRef} preset="close">
              <X className="size-3.5" />
            </NudgeIcon>
          </Button>
        </div>

        <ul className="no-scrollbar flex w-full min-h-0 flex-1 flex-col items-stretch justify-between gap-1 overflow-y-auto">
          {downloads.map(({ id, shortMeta, icon, nudge, progress }) => (
            <DownloadRailItem
              key={id}
              shortMeta={shortMeta}
              icon={icon}
              nudge={nudge}
              progress={progress}
              isOpen={isOpen}
            />
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
