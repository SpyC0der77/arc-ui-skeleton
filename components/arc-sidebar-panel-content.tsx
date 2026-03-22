"use client"

import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Plus,
  RotateCcw,
  Shapes,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const iconButtonClass =
  "size-8 rounded-md text-black/85 hover:bg-black/10 hover:text-black"

export function ArcSidebarPanelContent() {
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
            className={iconButtonClass}
            aria-label="Back"
          >
            <ArrowLeft className="size-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={iconButtonClass}
            aria-label="Forward"
          >
            <ArrowRight className="size-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={iconButtonClass}
            aria-label="Reload"
          >
            <RotateCcw className="size-[18px]" />
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        className="h-10 w-full justify-start gap-2 rounded-xl bg-black/10 px-4 text-sm font-semibold text-black shadow-none hover:bg-black/15"
      >
        <Lock className="size-3.5" />
        <span>yourdomain.com</span>
      </Button>

      <Button
        variant="ghost"
        className="h-auto w-fit justify-start gap-2 px-1 text-base font-normal text-black/45 hover:bg-transparent hover:text-black/65"
      >
        <Plus className="size-[18px]" />
        <span>New Tab</span>
      </Button>

      <Button
        variant="secondary"
        className="h-11 w-full justify-start gap-3 rounded-xl border border-black/10 bg-white px-3.5 text-base font-medium text-black/70 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_1px_3px_rgba(0,0,0,0.12)] hover:bg-white"
      >
        <Shapes className="size-[18px] text-black/80" />
        <span>Your Web Project</span>
      </Button>
    </>
  )
}
