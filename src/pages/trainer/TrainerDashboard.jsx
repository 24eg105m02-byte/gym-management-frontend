import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  Dumbbell,
  TrendingUp,
} from "lucide-react";
import TrainerLayout from "../../layouts/TrainerLayout";
import Loading from "../../components/Loading";
import { getTrainerDashboard } from "../../services/dashboardService";

function TrainerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrainerDashboard()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TrainerLayout title="Trainer Dashboard">
      <div className="fc-page-header">
        <div>
          <h1>Trainer Dashboard</h1>
          <p>Overview of your assigned members, workouts, and attendance</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/trainer/workouts" className="fc-btn fc-btn-primary">
            <Dumbbell size={16} />
            Workout Plans
          </Link>
          <Link to="/trainer/attendance" className="fc-btn fc-btn-ghost">
            <CalendarCheck size={16} />
            Attendance
          </Link>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && data && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <Users color="#ff4d00" />
              <div className="fc-stat-value">{data.assignedMembers ?? 0}</div>
              <div className="fc-stat-label">Assigned Members</div>
            </div>
            <div className="fc-card">
              <CalendarCheck color="#00c878" />
              <div className="fc-stat-value">{data.todayAttendance ?? 0}</div>
              <div className="fc-stat-label">Today&apos;s Attendance</div>
            </div>
            <div className="fc-card">
              <Dumbbell color="#3b82f6" />
              <div className="fc-stat-value">{data.activeWorkoutPlans ?? 0}</div>
              <div className="fc-stat-label">Active Workout Plans</div>
            </div>
            <div className="fc-card">
              <TrendingUp color="#ffb400" />
              <div className="fc-stat-value">
                {data.averageProgress ? `${data.averageProgress} kg` : "0 kg"}
              </div>
              <div className="fc-stat-label">Avg Member Weight</div>
            </div>
          </div>

          <div className="fc-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0 }}>Recent Assigned Members</h3>
              <Link
                to="/trainer/members"
                style={{ color: "#ff4d00", fontSize: "0.9rem", fontWeight: 600 }}
              >
                View All
              </Link>
            </div>

            <div className="fc-table-wrap">
              <table className="fc-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Membership</th>
                    <th>Valid Until</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.recentMembers || []).length > 0 ? (
                    data.recentMembers.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <strong>{m.name}</strong>
                        </td>
                        <td>{m.email}</td>
                        <td>{m.phone || "-"}</td>
                        <td>
                          <span className="fc-badge fc-badge-orange">
                            {m.membershipName || "No Plan"}
                          </span>
                        </td>
                        <td>{m.membershipEndDate || "-"}</td>
                        <td>
                          <span
                            className={`fc-badge ${
                              m.status === "ACTIVE"
                                ? "fc-badge-green"
                                : "fc-badge-red"
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="fc-empty">
                        No members assigned yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </TrainerLayout>
  );
}

export default TrainerDashboard;
