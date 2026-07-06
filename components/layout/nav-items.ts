import {
  Bot,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquareQuote,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  key: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  key: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    key: "platform",
    items: [
      { key: "dashboard", href: "/home", icon: LayoutDashboard },
      { key: "plans", href: "/plans", icon: ClipboardList },
      { key: "subscriptions", href: "/subscriptions", icon: CreditCard },
      { key: "users", href: "/users", icon: Users },
      { key: "claudeUsage", href: "/claude-usage", icon: Bot },
      { key: "financial", href: "/financial", icon: Wallet },
    ],
  },
  {
    key: "administration",
    items: [
      { key: "testimonials", href: "/testimonials", icon: MessageSquareQuote },
      { key: "settings", href: "/settings", icon: Settings },
    ],
  },
];

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function findActiveNavItem(pathname: string): NavItem | undefined {
  for (const group of navGroups) {
    const match = group.items.find((item) => isNavItemActive(pathname, item.href));
    if (match) {
      return match;
    }
  }

  return undefined;
}
