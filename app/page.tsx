import {
  ArrowLeft,
  ArrowRight,
  Lock,
  PanelLeft,
  Plus,
  RotateCcw,
  Shapes,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const iconButtonClass =
  "size-8 rounded-md text-black/85 hover:bg-black/10 hover:text-black";

export default function Home() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16.5rem",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-svh w-full bg-[#cec7d4]">
        <Sidebar
          className="border-none [&_[data-sidebar=sidebar]]:bg-[#CEC7D4]"
          collapsible="offcanvas"
        >
          <SidebarContent className="gap-7 px-3 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className={iconButtonClass}
                aria-label="Sidebar"
              >
                <PanelLeft className="size-[18px]" />
              </Button>
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
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-transparent p-1.5 md:p-2.5">
          <main className="size-full rounded-lg bg-white shadow-[0_1px_6px_rgba(68,55,80,0.22)]" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
