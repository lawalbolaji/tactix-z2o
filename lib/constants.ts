import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/v2/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Jobs",
    href: "/v2/dashboard/jobs",
    icon: "kanban",
    label: "Jobs",
  },
];

export const applicationReceivedResponse = `Dear {{user.name}},

We are pleased to inform you that you have been selected for the role of {{job.role}} at {{user.company}}. We congratulate you on this milestone and look forward to conquering the industry with your help.

Regards,
hr@{{user.company}}
`;