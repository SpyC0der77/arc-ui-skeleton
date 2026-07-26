"use client";

import * as React from "react";
import { Gift } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloads } from "./downloads-data";
import {
  NudgeIcon,
  playNudgeOnPress,
  type IconNudgePreset,
  type NudgeIconHandle,
} from "./nudge-icon";
import { useSidebar } from "./sidebar";

const CLOSE_DELAY_MS = 160;

/** Horizontal center of the trigger button, so the panel grows out of the icon. */
const DROPUP_ORIGIN_X_PX = 16;

function DownloadMenuItem({
  name,
  meta,
  icon: Icon,
  nudge,
  progress,
}: {
  name: string;
  meta: string;
  icon: (props: { className?: string }) => React.ReactNode;
  nudge: IconNudgePreset;
  progress?: number;
}) {
  const iconRef = React.useRef<NudgeIconHandle>(null);

  return (
    <li>
      <button
        type="button"
        role="menuitem"
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left outline-none hover:bg-black/6 focus-visible:bg-black/6"
        onPointerDown={playNudgeOnPress(iconRef)}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-black/6 text-black/60">
          <NudgeIcon ref={iconRef} preset={nudge}>
            <Icon className="size-3.5" />
          </NudgeIcon>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-black/80">
            {name}
          </span>
          <span className="block truncate text-[11px] text-black/45">{meta}</span>
          {progress != null && (
            <span className="mt-1 block h-0.75 w-full overflow-hidden rounded-full bg-black/10">
              <span
                className="block h-full rounded-full bg-black/40"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

export function SidebarDownloadsButton({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const closeTimerRef = React.useRef<number | null>(null);
  const giftRef = React.useRef<NudgeIconHandle>(null);
  const reduceMotion = useReducedMotion();
  const { downloadsRailOpen, toggleDownloadsRail } = useSidebar();

  const cancelClose = React.useCallback(() => {
    if (closeTimerRef.current == null) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  /** The rail already shows the same list, so hovering must not stack a drop-up on top of it. */
  const open = React.useCallback(() => {
    if (downloadsRailOpen) return;
    cancelClose();
    setIsOpen(true);
  }, [cancelClose, downloadsRailOpen]);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }, [cancelClose]);

  React.useEffect(() => cancelClose, [cancelClose]);

  function handleClick() {
    cancelClose();
    setIsOpen(false);
    toggleDownloadsRail();
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const };

  /** Content fades in behind the growth so the squashed frames never read as distorted text. */
  const contentTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.14, ease: "linear" as const, delay: 0.06 };

  return (
    <div className={cn("relative w-full", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Downloads"
        aria-expanded={isOpen}
        aria-pressed={downloadsRailOpen}
        className="size-8 rounded-md text-black/60 hover:bg-black/10 hover:text-black aria-expanded:bg-black/10 aria-expanded:text-black aria-pressed:bg-black/10 aria-pressed:text-black"
        onPointerEnter={open}
        onPointerLeave={scheduleClose}
        onFocus={open}
        onBlur={scheduleClose}
        onPointerDown={playNudgeOnPress(giftRef)}
        onClick={handleClick}
      >
        <NudgeIcon ref={giftRef} preset="gift">
          <Gift className="size-[18px]" />
        </NudgeIcon>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="Downloads"
            className="absolute bottom-full left-0 z-50 mb-1.5 w-full overflow-hidden rounded-xl border border-black/10 bg-white/95 shadow-[0_12px_40px_rgba(68,55,80,0.28)] backdrop-blur-sm"
            style={{ transformOrigin: `${DROPUP_ORIGIN_X_PX}px 100%` }}
            initial={{ opacity: 0, y: 8, scaleX: 0.35, scaleY: 0.15 }}
            animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
            exit={{ opacity: 0, y: 8, scaleX: 0.35, scaleY: 0.15 }}
            transition={transition}
            onPointerEnter={open}
            onPointerLeave={scheduleClose}
            onFocusCapture={open}
            onBlurCapture={scheduleClose}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={contentTransition}
            >
              <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
                <span className="text-xs font-semibold tracking-wide text-black/45 uppercase">
                  Downloads
                </span>
                <span className="text-xs text-black/35">
                  {downloads.length}
                </span>
              </div>
              <ul className="max-h-72 overflow-y-auto px-1.5 pb-1.5">
                {downloads.map((entry) => (
                  <DownloadMenuItem key={entry.id} {...entry} />
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
