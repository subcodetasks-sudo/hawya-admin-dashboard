"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { isNavItemActive, navGroups } from "@/components/layout/nav-items";
import { useDirection } from "@/components/ui/direction";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";

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
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              Howyeah
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              {t("tagline")}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.key}>
            <SidebarGroupLabel>{t(`groups.${group.key}`)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {group.items.map((item) => {
                  const isActive = isNavItemActive(pathname, item.href);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.key} >
                      <SidebarMenuButton
                        asChild
                        // isActive={isActive}
                        tooltip={t(item.key)}
                      >
                        <Link href={item.href}
                          className={`flex items-center gap-2 rounded-2xl p-6 text-sm font-medium text-gray-500 ${isActive ? "bg-sidebar-primary shadow-sm text-white hover:bg-sidebar-primary/90 hover:text-white font-semibold active:bg-sidebar-primary" : "hover:bg-sidebar-accent hover:text-sidebar"}`}
                        >
                          <Icon className="text-2xl"/>
                          <span>{t(item.key)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
