"use client";

import { LogOut, Search, Settings, UserCog } from "lucide-react";
import { useTranslations } from "next-intl";

import { findActiveNavItem } from "@/components/layout/nav-items";
import NotificationBellMenu from "@/features/admin-notifications/components/notification-bell-menu";
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
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Link, usePathname } from "@/i18n/navigation";

export default function DashboardHeader() {
  const t = useTranslations("Header");
  const tSidebar = useTranslations("Sidebar");
  const pathname = usePathname();
  const activeItem = findActiveNavItem(pathname);
  const { admin, logout } = useAuth();
  const accountLabel = admin?.email ?? t("accountName");
  const accountInitials = admin?.email
    ? admin.email.slice(0, 2).toUpperCase()
    : t("accountInitials");

  return (
    <header className="flex h-18 shrink-0 items-center gap-3 border-b px-4  bg-white">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-18" />

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
        <NotificationBellMenu />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 ps-1.5 pe-2">
              <Avatar >
                <AvatarFallback>{accountInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">
                {accountLabel}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{accountLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">
                <UserCog />
                {t("account")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings />
                {t("settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={logout}>
              <LogOut />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
