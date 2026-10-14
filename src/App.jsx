import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageMembers from "./pages/admin/ManageMembers";
import ManageTrainers from "./pages/admin/ManageTrainers";
import ManageMemberships from "./pages/admin/ManageMemberships";
import ManageAttendance from "./pages/admin/ManageAttendance";
import ManagePayments from "./pages/admin/ManagePayments";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerMembers from "./pages/trainer/TrainerMembers";
import TrainerAttendance from "./pages/trainer/TrainerAttendance";
import TrainerWorkouts from "./pages/trainer/TrainerWorkouts";
import TrainerProgress from "./pages/trainer/TrainerProgress";
import TrainerFeedback from "./pages/trainer/TrainerFeedback";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import TrainerSettings from "./pages/trainer/TrainerSettings";

import MemberDashboard from "./pages/member/MemberDashboard";
import MemberProfile from "./pages/member/MemberProfile";
import MemberMembership from "./pages/member/MemberMembership";
import MemberAttendance from "./pages/member/MemberAttendance";
import MemberWorkouts from "./pages/member/MemberWorkouts";
import MemberProgress from "./pages/member/MemberProgress";
import MemberPayments from "./pages/member/MemberPayments";
import MemberTrainer from "./pages/member/MemberTrainer";
import MemberSettings from "./pages/member/MemberSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN */}
        <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<ManageMembers />} />
          <Route path="/admin/trainers" element={<ManageTrainers />} />
          <Route path="/admin/memberships" element={<ManageMemberships />} />
          <Route path="/admin/attendance" element={<ManageAttendance />} />
          <Route path="/admin/payments" element={<ManagePayments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* TRAINER */}
        <Route element={<ProtectedRoute allowedRole="TRAINER" />}>
          <Route path="/trainer" element={<TrainerDashboard />} />
          <Route path="/trainer/members" element={<TrainerMembers />} />
          <Route path="/trainer/attendance" element={<TrainerAttendance />} />
          <Route path="/trainer/workouts" element={<TrainerWorkouts />} />
          <Route path="/trainer/progress" element={<TrainerProgress />} />
          <Route path="/trainer/feedback" element={<TrainerFeedback />} />
          <Route path="/trainer/profile" element={<TrainerProfile />} />
          <Route path="/trainer/settings" element={<TrainerSettings />} />
        </Route>

        {/* MEMBER */}
        <Route element={<ProtectedRoute allowedRole="MEMBER" />}>
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/member/profile" element={<MemberProfile />} />
          <Route path="/member/membership" element={<MemberMembership />} />
          <Route path="/member/attendance" element={<MemberAttendance />} />
          <Route path="/member/workouts" element={<MemberWorkouts />} />
          <Route path="/member/progress" element={<MemberProgress />} />
          <Route path="/member/payments" element={<MemberPayments />} />
          <Route path="/member/trainer" element={<MemberTrainer />} />
          <Route path="/member/settings" element={<MemberSettings />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;