import { useEffect, useState, useCallback } from "react";
import { BarChart3, IndianRupee, Star } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Loading from "../../components/Loading";
import { getReports } from "../../services/dashboardService";
import { getFeedback } from "../../services/feedbackService";

function AdminReports() {
  const [reports, setReports] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const loadReports = useCallback(async (start = startDate, end = endDate) => {
    setLoading(true);
    setError("");
    try {
      const [repData, fbData] = await Promise.all([
        getReports({ start, end }),
        getFeedback(),
      ]);
      setReports(repData);
      setFeedback(fbData || []);
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const maxGrowth = Math.max(
    1,
    ...(reports?.memberGrowth?.map((g) => Number(g.count) || 0) || [1])
  );

  return (
    <AdminLayout title="Reports & Analytics">
      <div className="fc-page-header">
        <div>
          <h1>Reports &amp; Analytics</h1>
          <p>Performance insights, revenue breakdown, and trainer metrics</p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label className="fc-label">From</label>
            <input
              type="date"
              className="fc-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="fc-label">To</label>
            <input
              type="date"
              className="fc-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="fc-btn fc-btn-primary"
            onClick={() => loadReports(startDate, endDate)}
          >
            <BarChart3 size={16} />
            Generate
          </button>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && reports && (
        <>
          <div className="fc-grid-2" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <IndianRupee color="#00c878" />
                <h3 style={{ margin: 0 }}>Period Revenue</h3>
              </div>
              <div className="fc-stat-value" style={{ color: "#00c878", marginTop: 16 }}>
                ₹{Number(reports.revenueReport?.total || 0).toLocaleString()}
              </div>
              <div className="fc-stat-label">
                From {reports.revenueReport?.start} to {reports.revenueReport?.end}
              </div>
            </div>

            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Member Growth (6 Months)</h3>
              <div className="fc-chart-bars">
                {(reports.memberGrowth || []).map((g) => (
                  <div
                    key={g.month}
                    className="fc-chart-bar"
                    style={{
                      height: `${(Number(g.count) / maxGrowth) * 140 + 8}px`,
                    }}
                    title={`${g.count} members`}
                  >
                    <span>{g.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fc-grid-2" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Trainer Performance</h3>
              <div className="fc-table-wrap">
                <table className="fc-table">
                  <thead>
                    <tr>
                      <th>Trainer</th>
                      <th>Assigned Members</th>
                      <th>Active Workout Plans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(reports.trainerPerformance || []).map((tp, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{tp.name}</strong>
                        </td>
                        <td>{tp.members}</td>
                        <td>{tp.workouts}</td>
                      </tr>
                    ))}
                    {(reports.trainerPerformance || []).length === 0 && (
                      <tr>
                        <td colSpan={3} className="fc-empty">
                          No trainer data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Membership Distribution</h3>
              {Object.entries(reports.membershipReport || {}).map(
                ([plan, count]) => (
                  <div
                    key={plan}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom: "1px solid #292929",
                    }}
                  >
                    <span>{plan}</span>
                    <span className="fc-badge fc-badge-orange">
                      {count} members
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="fc-card">
            <h3 style={{ marginTop: 0 }}>Member Feedback &amp; Reviews</h3>
            <div className="fc-table-wrap">
              <table className="fc-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Trainer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.length > 0 ? (
                    feedback.map((fb) => (
                      <tr key={fb.id}>
                        <td>
                          <strong>{fb.memberName}</strong>
                        </td>
                        <td>{fb.trainerName}</td>
                        <td>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              color: "#ffb400",
                              fontWeight: 700,
                            }}
                          >
                            <Star size={14} fill="#ffb400" />
                            {fb.rating} / 5
                          </span>
                        </td>
                        <td style={{ whiteSpace: "normal", maxWidth: 360 }}>
                          {fb.comment || "-"}
                        </td>
                        <td>
                          {fb.createdAt
                            ? new Date(fb.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="fc-empty">
                        No feedback submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminReports;
