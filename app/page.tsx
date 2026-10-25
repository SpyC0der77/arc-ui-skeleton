"use client"

import { useState } from "react"
import { DownloadDemo } from "@/components/download-demo"
import { ArcUrlCommandProvider } from "@/components/arc-url-command-menu"
import {
  ArcSidebarPanelContent,
  Sidebar,
  SidebarContent,
  SidebarDownloadsRail,
  SidebarHoverPeek,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/sidebar"
import { HomePageFrame } from "@/components/home-page-frame"

export default function Home() {
  const [downloadArrivalId, setDownloadArrivalId] = useState<string>()
  return (
    <SidebarProvider downloadArrivalId={downloadArrivalId}>
      <ArcUrlCommandProvider>
        <div className="flex min-h-svh w-full bg-[#cec7d4]">
          <SidebarDownloadsRail />

          <Sidebar
            className="border-none [&_[data-sidebar=sidebar]]:bg-[#CEC7D4]"
            collapsible="offcanvas"
          >
            <SidebarRail />
            <SidebarContent className="gap-7 py-4 pl-3 pr-1.5">
              <ArcSidebarPanelContent downloadArrivalId={downloadArrivalId} />
            </SidebarContent>
          </Sidebar>

          <SidebarInset
            className="bg-transparent"
          >
            <HomePageFrame>
              <DownloadDemo onArrival={setDownloadArrivalId} />
            </HomePageFrame>
          </SidebarInset>

          <SidebarHoverPeek />
        </div>
      </ArcUrlCommandProvider>
    </SidebarProvider>
  )
}
