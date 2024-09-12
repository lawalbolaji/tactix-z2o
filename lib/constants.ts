import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Jobs",
    href: "/dashboard/jobs",
    icon: "kanban",
    label: "Jobs",
  },
];

export const applicationReceivedResponse = `Dear {{user.name}},

We are pleased to inform you that you have been selected for the role of {{job.role}} at {{user.company}}. We congratulate you on this milestone and look forward to conquering the industry with your help.

Regards,
hr@{{user.company}}
`;


export const AUTH_SUCCESS_REDIRECT_URI = "/dashboard";
export const AUTH_FAIL_REDIRECT_URI = "/";

export const AuthErrorCode = 403;
export const DataNotFoundErrorCode = 404;
