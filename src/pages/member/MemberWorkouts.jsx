import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";
import MemberLayout from "../../layouts/MemberLayout";
import Loading from "../../components/Loading";
import { getWorkouts } from "../../services/workoutService";

function MemberWorkouts() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getWorkouts()
      .then((data) => setPlans(data || []))
      .catch((err) => setError(err.message || "Failed to load workout plans"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MemberLayout title="My Workout Plan">
      <div className="fc-page-header">
        <div>
          <h1>My Workout Plans</h1>
          <p>Follow the personalized exercise routines created by your trainer</p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {plans.length === 0 ? (
            <div className="fc-card fc-empty">
              No workout plans assigned yet.
            </div>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="fc-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Dumbbell color="#ff4d00" size={20} />
                    <h3 style={{ margin: 0 }}>{plan.title}</h3>
                  </div>
                  <span
                    className={`fc-badge ${
                      plan.status === "ACTIVE"
                        ? "fc-badge-green"
                        : "fc-badge-red"
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>

                <p style={{ color: "#aaa", fontSize: "0.9rem", margin: "4px 0" }}>
                  <strong>Goal:</strong> {plan.goal || "-"} &bull;{" "}
                  <strong>Trainer:</strong> {plan.trainerName || "-"} &bull;{" "}
                  <strong>Schedule:</strong> {plan.startDate || "-"} to{" "}
                  {plan.endDate || "Ongoing"}
                </p>
                {plan.description && (
                  <p style={{ color: "#777", fontSize: "0.85rem", marginBottom: 14 }}>
                    {plan.description}
                  </p>
                )}

                <div className="fc-table-wrap">
                  <table className="fc-table">
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Sets</th>
                        <th>Reps</th>
                        <th>Weight (kg)</th>
                        <th>Rest</th>
                        <th>Coach Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(plan.exercises || []).map((ex, i) => (
                        <tr key={ex.id || i}>
                          <td>
                            <strong>{ex.name}</strong>
                          </td>
                          <td>{ex.sets ?? "-"}</td>
                          <td>{ex.reps ?? "-"}</td>
                          <td>{ex.weight ?? "-"}</td>
                          <td>{ex.restTime || "-"}</td>
                          <td>{ex.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </MemberLayout>
  );
}

export default MemberWorkouts;
