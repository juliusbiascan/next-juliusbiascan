"use client"

import Link from "next/link"
import {
  Briefcase,
  Contact,
  House,
  LayoutDashboard,
  MessageCircle,
  FolderKanban,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

const nav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Home Section", url: "/home", icon: House },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Experience", url: "/experience", icon: Briefcase },
  { title: "Contacts", url: "/contacts", icon: Contact },
  { title: "Chat", url: "/chat", icon: MessageCircle },
]

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string }
}) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
                JB
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Julius Biascan</span>
                <span className="truncate text-xs">Portfolio admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Portfolio" items={nav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
