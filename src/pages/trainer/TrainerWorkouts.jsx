import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Dumbbell } from "lucide-react";
import TrainerLayout from "../../layouts/TrainerLayout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../../services/workoutService";
import { getMembers } from "../../services/memberService";

const emptyExercise = {
  name: "",
  sets: 3,
  reps: 10,
  weight: 20,
  restTime: "60s",
  notes: "",
};

function TrainerWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    memberId: "",
    title: "",
    goal: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    exercises: [{ ...emptyExercise }],
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [wList, mList] = await Promise.all([getWorkouts(), getMembers()]);
      setWorkouts(wList || []);
      setMembers(mList || []);
    } catch (err) {
      setError(err.message || "Failed to load workout plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormError("");
    setFormData({
      memberId: members[0]?.id || "",
      title: "",
      goal: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "ACTIVE",
      exercises: [{ ...emptyExercise }],
    });
    setModalOpen(true);
  };

  const openEdit = (plan) => {
    setEditing(plan);
    setFormError("");
    setFormData({
      memberId: plan.memberId || "",
      title: plan.title || "",
      goal: plan.goal || "",
      description: plan.description || "",
      startDate: plan.startDate || "",
      endDate: plan.endDate || "",
      status: plan.status || "ACTIVE",
      exercises:
        plan.exercises && plan.exercises.length > 0
          ? plan.exercises.map((e) => ({
              name: e.name || "",
              sets: e.sets ?? 3,
              reps: e.reps ?? 10,
              weight: e.weight ?? 0,
              restTime: e.restTime || "60s",
              notes: e.notes || "",
            }))
          : [{ ...emptyExercise }],
    });
    setModalOpen(true);
  };

  const updateExerciseField = (index, field, value) => {
    setFormData((prev) => {
      const next = [...prev.exercises];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, exercises: next };
    });
  };

  const addExerciseRow = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { ...emptyExercise }],
    }));
  };

  const removeExerciseRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      memberId: Number(formData.memberId),
      title: formData.title.trim(),
      goal: formData.goal.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      status: formData.status,
      exercises: formData.exercises
        .filter((ex) => ex.name && ex.name.trim())
        .map((ex) => ({
          name: ex.name.trim(),
          sets: ex.sets !== "" ? Number(ex.sets) : null,
          reps: ex.reps !== "" ? Number(ex.reps) : null,
          weight: ex.weight !== "" ? Number(ex.weight) : null,
          restTime: ex.restTime || null,
          notes: ex.notes || null,
        })),
    };

    try {
      if (editing) {
        await updateWorkout(editing.id, payload);
      } else {
        await createWorkout(payload);
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || "Failed to save workout plan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout plan?")) return;
    try {
      await deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete workout plan");
    }
  };

  return (
    <TrainerLayout title="Workout Plans">
      <div className="fc-page-header">
        <div>
          <h1>Workout Plans</h1>
          <p>Design and manage personalized training routines for your members</p>
        </div>
        <button className="fc-btn fc-btn-primary" onClick={openCreate}>
          <Plus size={18} />
          Create Workout Plan
        </button>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {workouts.length === 0 ? (
            <div className="fc-card fc-empty">
              No workout plans created yet. Click &ldquo;Create Workout Plan&rdquo; to
              get started.
            </div>
          ) : (
            workouts.map((plan) => (
              <div key={plan.id} className="fc-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 4,
                      }}
                    >
                      <Dumbbell size={18} color="#ff4d00" />
                      <h3 style={{ margin: 0 }}>{plan.title}</h3>
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
                      <strong>Member:</strong> {plan.memberName} &bull;{" "}
                      <strong>Goal:</strong> {plan.goal || "General Fitness"}
                    </p>
                    {plan.description && (
                      <p style={{ color: "#777", fontSize: "0.85rem", margin: 0 }}>
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="fc-btn fc-btn-ghost"
                      onClick={() => openEdit(plan)}
                    >
                      <Edit size={15} />
                      Edit
                    </button>
                    <button
                      className="fc-btn fc-btn-danger"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="fc-table-wrap">
                  <table className="fc-table">
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Sets</th>
                        <th>Reps</th>
                        <th>Weight (kg)</th>
                        <th>Rest</th>
                        <th>Notes</th>
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
                      {(plan.exercises || []).length === 0 && (
                        <tr>
                          <td colSpan={6} className="fc-empty">
                            No exercises added.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit Workout Plan" : "Create Workout Plan"}
        onClose={() => setModalOpen(false)}
        wide
      >
        {formError && (
          <div className="fc-error" style={{ padding: 10, marginBottom: 12 }}>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="fc-grid-2" style={{ marginBottom: 14 }}>
            <div>
              <label className="fc-label">Assigned Member *</label>
              <select
                className="fc-select"
                value={formData.memberId}
                onChange={(e) =>
                  setFormData({ ...formData, memberId: e.target.value })
                }
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
              <label className="fc-label">Plan Title *</label>
              <input
                className="fc-input"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Hypertrophy Split"
                required
              />
            </div>
            <div>
              <label className="fc-label">Goal</label>
              <input
                className="fc-input"
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value })
                }
                placeholder="e.g. Muscle Gain & Strength"
              />
            </div>
            <div>
              <label className="fc-label">Status</label>
              <select
                className="fc-select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div>
              <label className="fc-label">Start Date</label>
              <input
                type="date"
                className="fc-input"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="fc-label">End Date</label>
              <input
                type="date"
                className="fc-input"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="fc-label">Description</label>
            <textarea
              className="fc-textarea"
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <h4 style={{ margin: 0 }}>Exercises</h4>
            <button
              type="button"
              className="fc-btn fc-btn-ghost"
              onClick={addExerciseRow}
            >
              <Plus size={14} />
              Add Exercise
            </button>
          </div>

          {formData.exercises.map((ex, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #292929",
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div className="fc-grid-4" style={{ marginBottom: 8 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label className="fc-label">Exercise Name *</label>
                  <input
                    className="fc-input"
                    value={ex.name}
                    onChange={(e) =>
                      updateExerciseField(idx, "name", e.target.value)
                    }
                    placeholder="e.g. Barbell Squat"
                    required
                  />
                </div>
                <div>
                  <label className="fc-label">Sets</label>
                  <input
                    type="number"
                    className="fc-input"
                    value={ex.sets}
                    onChange={(e) =>
                      updateExerciseField(idx, "sets", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="fc-label">Reps</label>
                  <input
                    type="number"
                    className="fc-input"
                    value={ex.reps}
                    onChange={(e) =>
                      updateExerciseField(idx, "reps", e.target.value)
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 2fr auto",
                  gap: 10,
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <label className="fc-label">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="fc-input"
                    value={ex.weight}
                    onChange={(e) =>
                      updateExerciseField(idx, "weight", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="fc-label">Rest</label>
                  <input
                    className="fc-input"
                    value={ex.restTime}
                    onChange={(e) =>
                      updateExerciseField(idx, "restTime", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="fc-label">Notes</label>
                  <input
                    className="fc-input"
                    value={ex.notes}
                    onChange={(e) =>
                      updateExerciseField(idx, "notes", e.target.value)
                    }
                  />
                </div>
                {formData.exercises.length > 1 && (
                  <button
                    type="button"
                    className="fc-btn fc-btn-danger"
                    onClick={() => removeExerciseRow(idx)}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 16,
            }}
          >
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
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Plan"}
            </button>
          </div>
        </form>
      </Modal>
    </TrainerLayout>
  );
}

export default TrainerWorkouts;
