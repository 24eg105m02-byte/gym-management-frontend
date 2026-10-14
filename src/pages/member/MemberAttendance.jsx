import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import MemberLayout from "../../layouts/MemberLayout";
import Loading from "../../components/Loading";
import { getAttendance } from "../../services/attendanceService";

function MemberAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAttendance()
      .then((data) => setRecords(data || []))
      .catch((err) => setError(err.message || "Failed to load attendance"))
      .finally(() => setLoading(false));
  }, []);

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const rate =
    records.length > 0
      ? Math.round(((presentCount + lateCount) * 1000) / records.length) / 10
      : 0;

  const badgeClass = (status) => {
    if (status === "PRESENT") return "fc-badge-green";
    if (status === "LATE") return "fc-badge-yellow";
    return "fc-badge-red";
  };

  return (
    <MemberLayout title="My Attendance">
      <div className="fc-page-header">
        <div>
          <h1>My Attendance</h1>
          <p>Track your daily gym visits and consistency</p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <CalendarCheck color="#ff4d00" />
              <div className="fc-stat-value">{rate}%</div>
              <div className="fc-stat-label">Attendance Rate</div>
            </div>
            <div className="fc-card">
              <CheckCircle2 color="#00c878" />
              <div className="fc-stat-value">{presentCount}</div>
              <div className="fc-stat-label">Days Present</div>
            </div>
            <div className="fc-card">
              <Clock color="#ffb400" />
              <div className="fc-stat-value">{lateCount}</div>
              <div className="fc-stat-label">Days Late</div>
            </div>
            <div className="fc-card">
              <XCircle color="#ff5555" />
              <div className="fc-stat-value">{absentCount}</div>
              <div className="fc-stat-label">Days Absent</div>
            </div>
          </div>

          <div className="fc-card">
            <h3 style={{ marginTop: 0 }}>Attendance History</h3>
            <div className="fc-table-wrap">
              <table className="fc-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check-In Time</th>
                    <th>Check-Out Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length > 0 ? (
                    records.map((rec) => (
                      <tr key={rec.id}>
                        <td>
                          <strong>{rec.date}</strong>
                        </td>
                        <td>{rec.checkInTime || "-"}</td>
                        <td>{rec.checkOutTime || "-"}</td>
                        <td>
                          <span className={`fc-badge ${badgeClass(rec.status)}`}>
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="fc-empty">
                        No attendance records yet.
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

export default MemberAttendance;
