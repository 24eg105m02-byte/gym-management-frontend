import { useEffect, useState } from "react";
import {
  Users,
  UserRoundCheck,
  CalendarCheck,
  IndianRupee,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Loading from "../../components/Loading";
import { getAdminDashboard } from "../../services/dashboardService";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const maxAttendance = Math.max(
    1,
    ...(data?.weeklyAttendance?.map((d) => d.count) || [1])
  );
  const maxRevenue = Math.max(
    1,
    ...(data?.revenueOverview?.map((d) => Number(d.amount) || 0) || [1])
  );

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="fc-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of FitCore gym operations</p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && data && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <Users color="#ff4d00" />
              <div className="fc-stat-value">{data.totalMembers}</div>
              <div className="fc-stat-label">Total Members</div>
            </div>
            <div className="fc-card">
              <UserRoundCheck color="#00c878" />
              <div className="fc-stat-value">{data.activeTrainers}</div>
              <div className="fc-stat-label">Active Trainers</div>
            </div>
            <div className="fc-card">
              <CalendarCheck color="#3b82f6" />
              <div className="fc-stat-value">{data.todayAttendance}</div>
              <div className="fc-stat-label">Today&apos;s Attendance</div>
            </div>
            <div className="fc-card">
              <IndianRupee color="#ffb400" />
              <div className="fc-stat-value">₹{Number(data.monthlyRevenue || 0).toLocaleString()}</div>
              <div className="fc-stat-label">Monthly Revenue</div>
            </div>
          </div>

          <div className="fc-grid-2" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Weekly Attendance</h3>
              <div className="fc-chart-bars">
                {(data.weeklyAttendance || []).map((d) => (
                  <div
                    key={d.date}
                    className="fc-chart-bar"
                    style={{ height: `${(d.count / maxAttendance) * 140 + 8}px` }}
                    title={`${d.count}`}
                  >
                    <span>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Revenue Overview</h3>
              <div className="fc-chart-bars">
                {(data.revenueOverview || []).map((d) => (
                  <div
                    key={d.month}
                    className="fc-chart-bar"
                    style={{
                      height: `${(Number(d.amount) / maxRevenue) * 140 + 8}px`,
                      background: "linear-gradient(180deg,#ffb400,#9a6a00)",
                    }}
                  >
                    <span>{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fc-grid-2">
            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Membership Distribution</h3>
              {Object.keys(data.membershipDistribution || {}).length === 0 ? (
                <div className="fc-empty">No membership data</div>
              ) : (
                Object.entries(data.membershipDistribution).map(([name, count]) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid #292929",
                    }}
                  >
                    <span>{name}</span>
                    <strong>{count}</strong>
                  </div>
                ))
              )}
            </div>

            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Recent Members</h3>
              <div className="fc-table-wrap">
                <table className="fc-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Plan</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.recentMembers || []).map((m) => (
                      <tr key={m.id}>
                        <td>{m.name}</td>
                        <td>{m.membershipName || "-"}</td>
                        <td>
                          <span className={`fc-badge ${m.status === "ACTIVE" ? "fc-badge-green" : "fc-badge-red"}`}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(data.recentMembers || []).length === 0 && (
                      <tr>
                        <td colSpan={3}>
                          <div className="fc-empty">No members yet</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
