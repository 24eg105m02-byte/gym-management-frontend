import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Dumbbell,
  TrendingUp,
  MessageSquare,
  User,
  Settings,
} from "lucide-react";
import DashboardShell from "./DashboardShell";

const navItems = [
  { to: "/trainer", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true },
  { to: "/trainer/members", label: "My Members", icon: <Users size={18} /> },
  { to: "/trainer/attendance", label: "Attendance", icon: <CalendarCheck size={18} /> },
  { to: "/trainer/workouts", label: "Workout Plans", icon: <Dumbbell size={18} /> },
  { to: "/trainer/progress", label: "Member Progress", icon: <TrendingUp size={18} /> },
  { to: "/trainer/feedback", label: "Feedback", icon: <MessageSquare size={18} /> },
  { to: "/trainer/profile", label: "My Profile", icon: <User size={18} /> },
  { to: "/trainer/settings", label: "Settings", icon: <Settings size={18} /> },
];

function TrainerLayout({ children, title = "Trainer Panel" }) {
  return (
    <DashboardShell title={title} navItems={navItems}>
      {children}
    </DashboardShell>
  );
}

export default TrainerLayout;
