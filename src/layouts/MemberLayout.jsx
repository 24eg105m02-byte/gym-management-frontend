import {
  LayoutDashboard,
  User,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  TrendingUp,
  Wallet,
  UserRoundCheck,
  Settings,
} from "lucide-react";
import DashboardShell from "./DashboardShell";

const navItems = [
  { to: "/member", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true },
  { to: "/member/profile", label: "My Profile", icon: <User size={18} /> },
  { to: "/member/membership", label: "My Membership", icon: <CreditCard size={18} /> },
  { to: "/member/attendance", label: "My Attendance", icon: <CalendarCheck size={18} /> },
  { to: "/member/workouts", label: "My Workout Plan", icon: <Dumbbell size={18} /> },
  { to: "/member/progress", label: "My Progress", icon: <TrendingUp size={18} /> },
  { to: "/member/payments", label: "My Payments", icon: <Wallet size={18} /> },
  { to: "/member/trainer", label: "My Trainer", icon: <UserRoundCheck size={18} /> },
  { to: "/member/settings", label: "Settings", icon: <Settings size={18} /> },
];

function MemberLayout({ children, title = "Member Portal" }) {
  return (
    <DashboardShell title={title} navItems={navItems}>
      {children}
    </DashboardShell>
  );
}

export default MemberLayout;
