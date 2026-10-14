import { useEffect, useState } from "react";
import { TrendingUp, Activity, Dumbbell, Scale } from "lucide-react";
import MemberLayout from "../../layouts/MemberLayout";
import Loading from "../../components/Loading";
import { getProgress } from "../../services/progressService";

function MemberProgress() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProgress()
      .then((data) => setRecords(data || []))
      .catch((err) => setError(err.message || "Failed to load progress"))
      .finally(() => setLoading(false));
  }, []);

  const latest = records.length > 0 ? records[records.length - 1] : null;
  const maxWeight = Math.max(
    1,
    ...(records.map((r) => Number(r.weight) || 0).concat([1]))
  );

  return (
    <MemberLayout title="My Progress">
      <div className="fc-page-header">
        <div>
          <h1>My Fitness Progress</h1>
          <p>Track your weight, BMI, body fat, and strength trends over time</p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <Scale color="#ff4d00" />
              <div className="fc-stat-value">
                {latest?.weight != null ? `${latest.weight} kg` : "-"}
              </div>
              <div className="fc-stat-label">Latest Weight</div>
            </div>
            <div className="fc-card">
              <Activity color="#00c878" />
              <div className="fc-stat-value">{latest?.bmi ?? "-"}</div>
              <div className="fc-stat-label">Latest BMI</div>
            </div>
            <div className="fc-card">
              <TrendingUp color="#3b82f6" />
              <div className="fc-stat-value">
                {latest?.bodyFat != null ? `${latest.bodyFat}%` : "-"}
              </div>
              <div className="fc-stat-label">Body Fat</div>
            </div>
            <div className="fc-card">
              <Dumbbell color="#ffb400" />
              <div className="fc-stat-value">
                {latest?.strength != null ? `${latest.strength} kg` : "-"}
              </div>
              <div className="fc-stat-label">Strength Benchmark</div>
            </div>
          </div>

          {records.length > 0 && (
            <div className="fc-card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginTop: 0 }}>Weight Trend</h3>
              <div className="fc-chart-bars" style={{ paddingBottom: 24 }}>
                {records.map((r) => (
                  <div
                    key={r.id}
                    className="fc-chart-bar"
                    style={{
                      height: `${((Number(r.weight) || 0) / maxWeight) * 140 + 10}px`,
                    }}
                    title={`${r.weight} kg on ${r.recordDate}`}
                  >
                    <span>{(r.recordDate || "").slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="fc-card">
            <h3 style={{ marginTop: 0 }}>Progress Check-In History</h3>
            <div className="fc-table-wrap">
              <table className="fc-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight (kg)</th>
                    <th>Height (cm)</th>
                    <th>BMI</th>
                    <th>Body Fat (%)</th>
                    <th>Strength</th>
                    <th>Trainer Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length > 0 ? (
                    [...records].reverse().map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.recordDate}</strong>
                        </td>
                        <td>{r.weight ?? "-"}</td>
                        <td>{r.height ?? "-"}</td>
                        <td>
                          <span className="fc-badge fc-badge-orange">
                            {r.bmi ?? "-"}
                          </span>
                        </td>
                        <td>{r.bodyFat != null ? `${r.bodyFat}%` : "-"}</td>
                        <td>{r.strength ?? "-"}</td>
                        <td>{r.notes || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="fc-empty">
                        No progress check-ins logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </MemberLayout>
  );
}

export default MemberProgress;
