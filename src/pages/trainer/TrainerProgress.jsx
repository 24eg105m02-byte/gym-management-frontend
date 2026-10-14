import { useEffect, useState } from "react";
import { Plus, Edit } from "lucide-react";
import TrainerLayout from "../../layouts/TrainerLayout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import {
  getProgress,
  createProgress,
  updateProgress,
} from "../../services/progressService";
import { getMembers } from "../../services/memberService";

const todayStr = () => new Date().toISOString().split("T")[0];

function TrainerProgress() {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    memberId: "",
    weight: "",
    height: "",
    bodyFat: "",
    strength: "",
    notes: "",
    recordDate: todayStr(),
  });

  const loadData = async (memberId = selectedMemberId) => {
    setLoading(true);
    setError("");
    try {
      const params = memberId ? { memberId } : {};
      const [pList, mList] = await Promise.all([
        getProgress(params),
        getMembers(),
      ]);
      setRecords(pList || []);
      setMembers(mList || []);
    } catch (err) {
      setError(err.message || "Failed to load progress records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData("");
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFormError("");
    setFormData({
      memberId: selectedMemberId || members[0]?.id || "",
      weight: "",
      height: "170",
      bodyFat: "",
      strength: "",
      notes: "",
      recordDate: todayStr(),
    });
    setModalOpen(true);
  };

  const openEdit = (rec) => {
    setEditing(rec);
    setFormError("");
    setFormData({
      memberId: rec.memberId || "",
      weight: rec.weight ?? "",
      height: rec.height ?? "",
      bodyFat: rec.bodyFat ?? "",
      strength: rec.strength ?? "",
      notes: rec.notes || "",
      recordDate: rec.recordDate || todayStr(),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const payload = {
      memberId: Number(formData.memberId),
      weight: formData.weight !== "" ? Number(formData.weight) : null,
      height: formData.height !== "" ? Number(formData.height) : null,
      bodyFat: formData.bodyFat !== "" ? Number(formData.bodyFat) : null,
      strength: formData.strength !== "" ? Number(formData.strength) : null,
      notes: formData.notes.trim() || null,
      recordDate: formData.recordDate || null,
    };

    try {
      if (editing) {
        await updateProgress(editing.id, payload);
      } else {
        await createProgress(payload);
      }
      setModalOpen(false);
      await loadData(selectedMemberId);
    } catch (err) {
      setFormError(err.message || "Failed to save progress record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <TrainerLayout title="Member Progress">
      <div className="fc-page-header">
        <div>
          <h1>Member Progress</h1>
          <p>Log and monitor body metrics and strength milestones</p>
        </div>
        <button className="fc-btn fc-btn-primary" onClick={openAdd}>
          <Plus size={18} />
          Log Progress
        </button>
      </div>

      <div className="fc-card">
        <div className="fc-toolbar">
          <div style={{ minWidth: 240 }}>
            <label className="fc-label">Filter by Member</label>
            <select
              className="fc-select"
              value={selectedMemberId}
              onChange={(e) => {
                setSelectedMemberId(e.target.value);
                loadData(e.target.value);
              }}
            >
              <option value="">All Assigned Members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
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
                  <th>Weight (kg)</th>
                  <th>Height (cm)</th>
                  <th>BMI</th>
                  <th>Body Fat (%)</th>
                  <th>Strength</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.memberName}</strong>
                      </td>
                      <td>{r.recordDate}</td>
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
                      <td>
                        <button
                          className="fc-btn fc-btn-ghost"
                          style={{ padding: "6px 10px" }}
                          onClick={() => openEdit(r)}
                        >
                          <Edit size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="fc-empty">
                      No progress records found.
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
        title={editing ? "Update Progress Check-in" : "Log Member Progress"}
        onClose={() => setModalOpen(false)}
      >
        {formError && (
          <div className="fc-error" style={{ padding: 10, marginBottom: 12 }}>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="fc-grid-2" style={{ marginBottom: 14 }}>
            <div>
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
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="fc-label">Record Date *</label>
              <input
                type="date"
                className="fc-input"
                value={formData.recordDate}
                onChange={(e) =>
                  setFormData({ ...formData, recordDate: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="fc-label">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                className="fc-input"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="fc-label">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                className="fc-input"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
              />
            </div>
            <div>
              <label className="fc-label">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                className="fc-input"
                value={formData.bodyFat}
                onChange={(e) =>
                  setFormData({ ...formData, bodyFat: e.target.value })
                }
              />
            </div>
            <div>
              <label className="fc-label">Strength Score / 1RM (kg)</label>
              <input
                type="number"
                step="0.5"
                className="fc-input"
                value={formData.strength}
                onChange={(e) =>
                  setFormData({ ...formData, strength: e.target.value })
                }
              />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="fc-label">Coach Notes</label>
            <textarea
              className="fc-textarea"
              rows={2}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Observations, form improvements, goals..."
            />
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
              {saving ? "Saving..." : editing ? "Save Changes" : "Log Progress"}
            </button>
          </div>
        </form>
      </Modal>
    </TrainerLayout>
  );
}

export default TrainerProgress;
