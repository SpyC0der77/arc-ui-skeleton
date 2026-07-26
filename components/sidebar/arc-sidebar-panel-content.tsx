"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  Lock,
  Plus,
  RotateCcw,
  Shapes,
} from "lucide-react";

import { useArcUrlCommand } from "@/components/arc-url-command-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { NudgeIcon, playNudgeOnPress, type NudgeIconHandle } from "./nudge-icon";
import { SidebarDownloadsButton } from "./sidebar-downloads-button";
import { SidebarTrigger, useSidebar } from "./sidebar";
import { cn } from "@/lib/utils";

const iconButtonClass =
  "size-8 rounded-md text-black/85 hover:bg-black/10 hover:text-black";

const repoUrl = "https://github.com/SpyC0der77/arc-ui-skeleton";
const displayUrl = "arc-ui-skeleton.vercel.app";

export function ArcSidebarPanelContent() {
  const { layoutAnimating, dockFromPeek } = useSidebar();
  const { openUrlCommand } = useArcUrlCommand();
  const freezeChrome = layoutAnimating || dockFromPeek;
  const motionSafe = freezeChrome ? "transition-none" : "";

  const backRef = React.useRef<NudgeIconHandle>(null);
  const forwardRef = React.useRef<NudgeIconHandle>(null);
  const reloadRef = React.useRef<NudgeIconHandle>(null);
  const lockRef = React.useRef<NudgeIconHandle>(null);
  const plusRef = React.useRef<NudgeIconHandle>(null);
  const shapesRef = React.useRef<NudgeIconHandle>(null);
  const githubRef = React.useRef<NudgeIconHandle>(null);

  return (
    <>
      <div className="flex items-center justify-between">
        <SidebarTrigger
          size="icon"
          className={cn(iconButtonClass, "[&_svg]:size-[18px]")}
          aria-label="Close sidebar"
        />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(iconButtonClass, motionSafe)}
            aria-label="Back"
            onPointerDown={playNudgeOnPress(backRef)}
          >
            <NudgeIcon ref={backRef} preset="back" disabled={freezeChrome}>
              <ArrowLeft className="size-[18px]" />
            </NudgeIcon>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(iconButtonClass, motionSafe)}
            aria-label="Forward"
            onPointerDown={playNudgeOnPress(forwardRef)}
          >
            <NudgeIcon ref={forwardRef} preset="forward" disabled={freezeChrome}>
              <ArrowRight className="size-[18px]" />
            </NudgeIcon>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(iconButtonClass, motionSafe)}
            aria-label="Reload"
            onPointerDown={playNudgeOnPress(reloadRef)}
          >
            <NudgeIcon ref={reloadRef} preset="reload" disabled={freezeChrome}>
              <RotateCcw className="size-[18px]" />
            </NudgeIcon>
          </Button>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        title={displayUrl}
        className={cn(
          "h-10 min-w-0 w-full justify-start gap-2 rounded-xl bg-black/10 px-4 text-sm font-semibold text-black shadow-none hover:bg-black/15",
          motionSafe,
        )}
        onClick={openUrlCommand}
        onPointerDown={playNudgeOnPress(lockRef)}
        aria-label="Open address bar"
      >
        <NudgeIcon ref={lockRef} preset="lock" disabled={freezeChrome}>
          <Lock className="size-3.5 shrink-0" aria-hidden />
        </NudgeIcon>
        <span className="min-w-0 truncate text-left">{displayUrl}</span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        className={cn(
          "h-auto w-fit justify-start gap-2 px-1 text-base font-normal text-black/45 hover:bg-transparent hover:text-black/65",
          motionSafe,
        )}
        onClick={openUrlCommand}
        onPointerDown={playNudgeOnPress(plusRef)}
        aria-label="New tab"
      >
        <NudgeIcon ref={plusRef} preset="plus" disabled={freezeChrome}>
          <Plus className="size-[18px]" />
        </NudgeIcon>
        <span>New Tab</span>
      </Button>

      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="secondary"
          className={cn(
            "h-11 w-full justify-start gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 text-base font-medium text-black/70 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_1px_3px_rgba(0,0,0,0.12)] hover:bg-white",
            motionSafe,
          )}
          onPointerDown={playNudgeOnPress(shapesRef)}
        >
          <NudgeIcon ref={shapesRef} preset="shapes" disabled={freezeChrome}>
            <Shapes className="size-[18px] text-black/80" />
          </NudgeIcon>
          <span className="truncate max-w-full">Arc Browser UI Skeleton</span>
        </Button>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-11 w-full justify-start gap-1.5 rounded-xl border-none bg-[#CEC7D4] px-3.5 text-base font-medium text-black/50 shadow-none hover:bg-[#e3dfea] hover:no-underline",
            motionSafe,
          )}
          onPointerDown={playNudgeOnPress(githubRef)}
        >
          <NudgeIcon ref={githubRef} preset="github" disabled={freezeChrome}>
            <Github className="size-[18px] text-black/60" aria-hidden />
          </NudgeIcon>
          <span className="truncate max-w-full">View on GitHub</span>
        </a>
      </div>

      <div className="mt-auto flex items-center">
        <SidebarDownloadsButton />
      </div>
    </>
  );
}
