import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  CalendarCheck,
  TrendingUp,
  Wallet,
  Dumbbell,
} from "lucide-react";
import MemberLayout from "../../layouts/MemberLayout";
import Loading from "../../components/Loading";
import { getMemberDashboard } from "../../services/dashboardService";

function MemberDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMemberDashboard()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const ms = data?.membership || {};

  return (
    <MemberLayout title="Member Dashboard">
      <div className="fc-page-header">
        <div>
          <h1>Welcome Back!</h1>
          <p>Your fitness overview, membership status, and active workout plan</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/member/workouts" className="fc-btn fc-btn-primary">
            <Dumbbell size={16} />
            My Workouts
          </Link>
          <Link to="/member/membership" className="fc-btn fc-btn-ghost">
            <CreditCard size={16} />
            Membership
          </Link>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && data && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <CreditCard color="#ff4d00" />
              <div className="fc-stat-value">{ms.name || "No Plan"}</div>
              <div className="fc-stat-label">
                {ms.remainingDays != null
                  ? `${ms.remainingDays} days remaining`
                  : "Subscribe to a plan"}
              </div>
            </div>
            <div className="fc-card">
              <CalendarCheck color="#00c878" />
              <div className="fc-stat-value">
                {data.attendancePercentage ?? 0}%
              </div>
              <div className="fc-stat-label">Attendance Rate</div>
            </div>
            <div className="fc-card">
              <TrendingUp color="#3b82f6" />
              <div className="fc-stat-value">
                {data.currentWeight != null ? `${data.currentWeight} kg` : "-"}
              </div>
              <div className="fc-stat-label">Current Weight</div>
            </div>
            <div className="fc-card">
              <Wallet color="#ffb400" />
              <div className="fc-stat-value">
                {data.nextPayment
                  ? `₹${Number(data.nextPayment.amount).toLocaleString()}`
                  : "All Clear"}
              </div>
              <div className="fc-stat-label">
                {data.nextPayment ? "Pending Payment" : "Billing Status"}
              </div>
            </div>
          </div>

          <div className="fc-grid-2">
            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Current Workout Plan</h3>
              {data.workoutSummary ? (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <strong style={{ fontSize: "1.1rem" }}>
                      {data.workoutSummary.title}
                    </strong>
                    <span className="fc-badge fc-badge-green">
                      {data.workoutSummary.status}
                    </span>
                  </div>
                  <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                    <strong>Goal:</strong> {data.workoutSummary.goal || "-"} &bull;{" "}
                    <strong>Coach:</strong> {data.workoutSummary.trainerName || "-"}
                  </p>
                  <div className="fc-table-wrap" style={{ marginTop: 12 }}>
                    <table className="fc-table">
                      <thead>
                        <tr>
                          <th>Exercise</th>
                          <th>Sets</th>
                          <th>Reps</th>
                          <th>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data.workoutSummary.exercises || []).map((ex, i) => (
                          <tr key={ex.id || i}>
                            <td>{ex.name}</td>
                            <td>{ex.sets}</td>
                            <td>{ex.reps}</td>
                            <td>{ex.weight ? `${ex.weight} kg` : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="fc-empty">
                  No workout plan assigned yet. Your trainer will create one for you!
                </div>
              )}
            </div>

            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Membership Details</h3>
              {ms.name ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #292929",
                      paddingBottom: 10,
                    }}
                  >
                    <span style={{ color: "#888" }}>Plan</span>
                    <strong>{ms.name}</strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #292929",
                      paddingBottom: 10,
                    }}
                  >
                    <span style={{ color: "#888" }}>Monthly Price</span>
                    <strong>₹{Number(ms.price || 0).toLocaleString()}</strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #292929",
                      paddingBottom: 10,
                    }}
                  >
                    <span style={{ color: "#888" }}>Start Date</span>
                    <strong>{ms.startDate || "-"}</strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #292929",
                      paddingBottom: 10,
                    }}
                  >
                    <span style={{ color: "#888" }}>End Date</span>
                    <strong>{ms.endDate || "-"}</strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#888" }}>Status</span>
                    <span className="fc-badge fc-badge-green">
                      {ms.status || "ACTIVE"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="fc-empty">
                  <p>You do not have an active membership plan.</p>
                  <Link
                    to="/member/membership"
                    className="fc-btn fc-btn-primary"
                    style={{ marginTop: 12 }}
                  >
                    Choose a Plan
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </MemberLayout>
  );
}

export default MemberDashboard;
