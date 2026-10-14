 HEAD
import { useEffect, useState, useCallback } from "react";

import {
  Plus,
  Edit,
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import {
  getAttendance,
  getAttendanceStats,
  createAttendance,
  updateAttendance,
} from "../../services/attendanceService";
import { getMembers } from "../../services/memberService";

const todayStr = () => new Date().toISOString().split("T")[0];

function ManageAttendance() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    todayTotal: 0,
    present: 0,
    late: 0,
    absent: 0,
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [filterDate, setFilterDate] = useState("");
  const [filterMemberId, setFilterMemberId] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    memberId: "",
    date: todayStr(),
    status: "PRESENT",
    checkInTime: "08:00",
    checkOutTime: "09:30",
  });

  const loadData = useCallback(async (dateVal = filterDate, memberVal = filterMemberId) => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (dateVal) params.date = dateVal;
      if (memberVal) params.memberId = memberVal;

      const [attList, attStats, memList] = await Promise.all([
        getAttendance(params),
        getAttendanceStats(),
        getMembers(),
      ]);
      setRecords(attList || []);
      setStats(attStats || { todayTotal: 0, present: 0, late: 0, absent: 0 });
      setMembers(memList || []);
    } catch (err) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }, [filterDate, filterMemberId]);

  useEffect(() => {
    loadData("", "");
  }, [loadData]);

  const handleFilterChange = (newDate, newMember) => {
    setFilterDate(newDate);
    setFilterMemberId(newMember);
    loadData(newDate, newMember);
  };

  const openMarkModal = () => {
    setEditing(null);
    setFormError("");
    setFormData({
      memberId: members[0]?.id || "",
      date: filterDate || todayStr(),
      status: "PRESENT",
      checkInTime: "08:00",
      checkOutTime: "09:30",
    });
    setModalOpen(true);
  };

  const openEditModal = (rec) => {
    setEditing(rec);
    setFormError("");
    setFormData({
      memberId: rec.memberId,
      date: rec.date || todayStr(),
      status: rec.status || "PRESENT",
      checkInTime: (rec.checkInTime || "08:00").slice(0, 5),
      checkOutTime: (rec.checkOutTime || "").slice(0, 5),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const payload = {
      memberId: Number(formData.memberId),
      date: formData.date || null,
      status: formData.status,
      checkInTime: formData.checkInTime || null,
      checkOutTime: formData.checkOutTime || null,
    };

    try {
      if (editing) {
        await updateAttendance(editing.id, payload);
      } else {
        await createAttendance(payload);
      }
      setModalOpen(false);
      await loadData(filterDate, filterMemberId);
    } catch (err) {
      setFormError(err.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const badgeClass = (status) => {
    if (status === "PRESENT") return "fc-badge-green";
    if (status === "LATE") return "fc-badge-yellow";
    return "fc-badge-red";
  };

  return (
    <AdminLayout title="Manage Attendance">
      <div className="fc-page-header">
        <div>
          <h1>Attendance Tracking</h1>
          <p>Monitor and record daily member check-ins</p>
        </div>
        <button className="fc-btn fc-btn-primary" onClick={openMarkModal}>
          <Plus size={18} />
          Mark Attendance
        </button>
      </div>

      <div className="fc-grid-4" style={{ marginBottom: 20 }}>
        <div className="fc-card">
          <CalendarCheck color="#ff4d00" />
          <div className="fc-stat-value">{stats.todayTotal ?? 0}</div>
          <div className="fc-stat-label">Today&apos;s Total</div>
        </div>
        <div className="fc-card">
          <CheckCircle2 color="#00c878" />
          <div className="fc-stat-value">{stats.present ?? 0}</div>
          <div className="fc-stat-label">Present Today</div>
        </div>
        <div className="fc-card">
          <Clock color="#ffb400" />
          <div className="fc-stat-value">{stats.late ?? 0}</div>
          <div className="fc-stat-label">Late Today</div>
        </div>
        <div className="fc-card">
          <XCircle color="#ff5555" />
          <div className="fc-stat-value">{stats.absent ?? 0}</div>
          <div className="fc-stat-label">Absent Today</div>
        </div>
      </div>

      <div className="fc-card">
        <div className="fc-toolbar">
          <div style={{ minWidth: 220 }}>
            <label className="fc-label">Filter by Member</label>
            <select
              className="fc-select"
              value={filterMemberId}
              onChange={(e) => handleFilterChange(filterDate, e.target.value)}
            >
              <option value="">All Members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: 180 }}>
            <label className="fc-label">Filter by Date</label>
            <input
              type="date"
              className="fc-input"
              value={filterDate}
              onChange={(e) => handleFilterChange(e.target.value, filterMemberId)}
            />
          </div>
          {(filterDate || filterMemberId) && (
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="button"
                className="fc-btn fc-btn-ghost"
                onClick={() => handleFilterChange("", "")}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {loading && <Loading />}
        {error && <div className="fc-error">{error}</div>}

        {!loading && !error && (
          <div className="fc-table-wrap">
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Date</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((rec) => (
                    <tr key={rec.id}>
                      <td>
                        <strong>{rec.memberName}</strong>
                      </td>
                      <td>{rec.date}</td>
                      <td>{rec.checkInTime || "-"}</td>
                      <td>{rec.checkOutTime || "-"}</td>
                      <td>
                        <span className={`fc-badge ${badgeClass(rec.status)}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="fc-btn fc-btn-ghost"
                          style={{ padding: "6px 10px" }}
                          onClick={() => openEditModal(rec)}
                        >
                          <Edit size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="fc-empty">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editing ? "Edit Attendance" : "Mark Attendance"}
        onClose={() => setModalOpen(false)}
      >
        {formError && (
          <div className="fc-error" style={{ padding: 10, marginBottom: 12 }}>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label className="fc-label">Member *</label>
            <select
              className="fc-select"
              value={formData.memberId}
              onChange={(e) =>
                setFormData({ ...formData, memberId: e.target.value })
              }
              disabled={!!editing}
              required
            >
              <option value="">Select Member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div className="fc-grid-2" style={{ marginBottom: 14 }}>
            <div>
              <label className="fc-label">Date *</label>
              <input
                type="date"
                className="fc-input"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="fc-label">Status *</label>
              <select
                className="fc-select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="PRESENT">PRESENT</option>
                <option value="LATE">LATE</option>
                <option value="ABSENT">ABSENT</option>
              </select>
            </div>
          </div>

          <div className="fc-grid-2" style={{ marginBottom: 18 }}>
            <div>
              <label className="fc-label">Check-In Time</label>
              <input
                type="time"
                className="fc-input"
                value={formData.checkInTime}
                onChange={(e) =>
                  setFormData({ ...formData, checkInTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="fc-label">Check-Out Time</label>
              <input
                type="time"
                className="fc-input"
                value={formData.checkOutTime}
                onChange={(e) =>
                  setFormData({ ...formData, checkOutTime: e.target.value })
                }
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              className="fc-btn fc-btn-ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="fc-btn fc-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : editing ? "Update" : "Mark Attendance"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default ManageAttendance;
