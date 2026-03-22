import type { CSSProperties } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ArcSidebarPanelContent } from "@/components/arc-sidebar-panel-content"
import { HomePageFrame } from "@/components/home-page-frame"
import { SidebarHoverPeek } from "@/components/sidebar-hover-peek"

export default function Home() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16.5rem",
        } as CSSProperties
      }
    >
      <div className="flex min-h-svh w-full bg-[#cec7d4]">
        <Sidebar
          className="border-none [&_[data-sidebar=sidebar]]:bg-[#CEC7D4]"
          collapsible="offcanvas"
        >
          <SidebarContent className="gap-7 px-3 py-4">
            <ArcSidebarPanelContent />
          </SidebarContent>
        </Sidebar>

        <SidebarInset
          className="bg-transparent p-1.5 md:p-2.5 md:peer-data-[state=collapsed]:p-0 md:peer-data-[state=collapsed]:[&_[data-slot=page-frame]]:rounded-none md:peer-data-[state=collapsed]:[&_[data-slot=page-frame]]:shadow-none"
        >
          <HomePageFrame />
        </SidebarInset>

        <SidebarHoverPeek>
          <SidebarContent className="gap-7 px-3 py-4">
            <ArcSidebarPanelContent />
          </SidebarContent>
        </SidebarHoverPeek>
      </div>
    </SidebarProvider>
  )
}
