"use client";

import { Bell, LogOut, Search, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

import { findActiveNavItem } from "@/components/layout/nav-items";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";

export default function DashboardHeader() {
  const t = useTranslations("Header");
  const tSidebar = useTranslations("Sidebar");
  const pathname = usePathname();
  const activeItem = findActiveNavItem(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4  bg-white">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-8" />

      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/home">{t("breadcrumbRoot")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {activeItem ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{tSidebar(activeItem.key)}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="relative ms-2 hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("searchPlaceholder")} className="ps-8" />
      </div>

      <div className="ms-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label={t("notifications")}>
          <Bell />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 ps-1.5 pe-2">
              <Avatar size="sm">
                <AvatarFallback>{t("accountInitials")}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">
                {t("accountName")}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{t("accountName")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings />
                {t("settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" disabled>
              <LogOut />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
