import {
  LayoutDashboard,
  Users,
  UserRoundCheck,
  CreditCard,
  CalendarCheck,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";
import DashboardShell from "./DashboardShell";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true },
  { to: "/admin/members", label: "Members", icon: <Users size={18} /> },
  { to: "/admin/trainers", label: "Trainers", icon: <UserRoundCheck size={18} /> },
  { to: "/admin/memberships", label: "Memberships", icon: <CreditCard size={18} /> },
  { to: "/admin/attendance", label: "Attendance", icon: <CalendarCheck size={18} /> },
  { to: "/admin/payments", label: "Payments", icon: <Wallet size={18} /> },
  { to: "/admin/reports", label: "Reports", icon: <BarChart3 size={18} /> },
  { to: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];

function AdminLayout({ children, title = "Admin Panel" }) {
  return (
    <DashboardShell title={title} navItems={navItems}>
      {children}
    </DashboardShell>
  );
}

export default AdminLayout;
