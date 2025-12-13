import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  BookOpen,
  Mail
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  comingSoon?: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Projects",
      menus: [
        {
          href: "/app",
          label: "Projects",
          icon: LayoutGrid,
          submenus: [],
          active: pathname === "/app" || pathname.startsWith("/app/projects"),
        },
        {
          href: "/app/mass-mailer",
          label: "Mass Mailer",
          icon: Mail,
          comingSoon: true
        },
        {
          href: "/app/archives",
          label: "Archives",
          icon: Tag,
          comingSoon: true
        },
        {
          href: "/app/templates",
          label: "Templates",
          icon: BookOpen
        }
      ]
    },
    {
      groupLabel: "Account",
      menus: [
        {
          href: "/app/account",
          label: "Account",
          icon: Users
        },
        {
          href: "/app/settings",
          label: "Settings",
          icon: Settings
        }
      ]
    },
    {
      groupLabel: "Help & Support",
      menus: [
        {
          href: "/app/tutorials",
          label: "Tutorials",
          icon: BookOpen
        }
      ]
    }
  ];
}
