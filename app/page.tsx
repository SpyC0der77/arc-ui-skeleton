import { ArcUrlCommandProvider } from "@/components/arc-url-command-menu"
import {
  ArcSidebarPanelContent,
  Sidebar,
  SidebarContent,
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
          <Sidebar
            className="border-none [&_[data-sidebar=sidebar]]:bg-[#CEC7D4]"
            collapsible="offcanvas"
          >
            <SidebarRail />
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
      </ArcUrlCommandProvider>
    </SidebarProvider>
  )
}
