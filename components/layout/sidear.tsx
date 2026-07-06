"use client";

import {
  Bot,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquareQuote,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useDirection } from "@/components/ui/direction";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";

const navItems = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "plans", href: "/plans", icon: ClipboardList },
  { key: "subscriptions", href: "/subscriptions", icon: CreditCard },
  { key: "users", href: "/users", icon: Users },
  { key: "claudeUsage", href: "/claude-usage", icon: Bot },
  { key: "financial", href: "/financial", icon: Wallet },
  { key: "testimonials", href: "/testimonials", icon: MessageSquareQuote },
  { key: "settings", href: "/settings", icon: Settings },
] as const;

export default function AppSidebar() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const direction = useDirection();

  return (
    <Sidebar
      side={direction === "rtl" ? "right" : "left"}
      dir={direction}
      collapsible="icon"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            H
          </div>
          <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
            Howyeah
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={t(item.key)}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{t(item.key)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
