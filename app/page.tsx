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
  return (
    <SidebarProvider>
      <ArcUrlCommandProvider>
        <div className="flex min-h-svh w-full bg-[#cec7d4]">
          <SidebarDownloadsRail />

          <Sidebar
            className="border-none [&_[data-sidebar=sidebar]]:bg-[#CEC7D4]"
            collapsible="offcanvas"
          >
            <SidebarRail />
            <SidebarContent className="gap-7 py-4 pl-3 pr-1.5">
              <ArcSidebarPanelContent />
            </SidebarContent>
          </Sidebar>

          <SidebarInset
            className="bg-transparent py-1.5 pl-0.75 pr-1.5 md:py-2.5 md:pl-0 md:pr-2.5 md:peer-data-[state=collapsed]:p-0 md:peer-data-[state=collapsed]:[&_[data-slot=page-frame]]:rounded-none md:peer-data-[state=collapsed]:[&_[data-slot=page-frame]]:shadow-none"
          >
            <HomePageFrame />
          </SidebarInset>

          <SidebarHoverPeek>
            <SidebarContent className="gap-7 py-4 pl-3 pr-1.5">
              <ArcSidebarPanelContent />
            </SidebarContent>
          </SidebarHoverPeek>
        </div>
      </ArcUrlCommandProvider>
    </SidebarProvider>
  )
}
