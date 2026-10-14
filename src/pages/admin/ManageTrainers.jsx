import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Power,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import {
  getTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  toggleTrainerStatus,
} from "../../services/trainerService";
import "./ManageTrainers.css";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialization: "",
  experience: 1,
  salary: "",
  joiningDate: "",
  status: "ACTIVE",
};

function ManageTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadTrainers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTrainers();
      setTrainers(data || []);
    } catch (err) {
      setError(err.message || "Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (trainer.name || "").toLowerCase().includes(q) ||
        (trainer.email || "").toLowerCase().includes(q) ||
        (trainer.phone || "").includes(search) ||
        (trainer.specialization || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" || trainer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trainers, search, statusFilter]);

  const activeCount = trainers.filter((t) => t.status === "ACTIVE").length;
  const inactiveCount = trainers.filter((t) => t.status === "INACTIVE").length;
  const totalMembers = trainers.reduce(
    (sum, t) => sum + Number(t.assignedMemberCount || 0),
    0
  );

  const openAddModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setSelectedTrainer(null);
    setModalType("add");
  };

  const openEditModal = (trainer) => {
    setFormData({
      name: trainer.name || "",
      email: trainer.email || "",
      password: "",
      phone: trainer.phone || "",
      specialization: trainer.specialization || "",
      experience: trainer.experience ?? 0,
      salary: trainer.salary ?? "",
      joiningDate: trainer.joiningDate || "",
      status: trainer.status || "ACTIVE",
    });
    setFormError("");
    setSelectedTrainer(trainer);
    setModalType("edit");
  };

  const openViewModal = (trainer) => {
    setSelectedTrainer(trainer);
    setModalType("view");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTrainer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      specialization: formData.specialization.trim(),
      experience: formData.experience !== "" ? Number(formData.experience) : 0,
      salary: formData.salary !== "" ? Number(formData.salary) : null,
      joiningDate: formData.joiningDate || null,
      status: formData.status,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      if (modalType === "add") {
        const created = await createTrainer(payload);
        setTrainers((prev) => [created, ...prev]);
      } else if (modalType === "edit" && selectedTrainer) {
        const updated = await updateTrainer(selectedTrainer.id, payload);
        setTrainers((prev) =>
          prev.map((t) => (t.id === selectedTrainer.id ? updated : t))
        );
      }
      closeModal();
    } catch (err) {
      setFormError(err.message || "Failed to save trainer");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (trainer) => {
    try {
      const updated = await toggleTrainerStatus(trainer.id);
      setTrainers((prev) =>
        prev.map((t) => (t.id === trainer.id ? updated : t))
      );
    } catch (err) {
      alert(err.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
    try {
      await deleteTrainer(id);
      setTrainers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete trainer");
    }
  };

  return (
    <AdminLayout title="Manage Trainers">
      <div className="fc-page-header">
        <div>
          <h1>Manage Trainers</h1>
          <p>Manage your gym trainers, specializations and assigned members</p>
        </div>
        <button className="fc-btn fc-btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Add Trainer
        </button>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <Users color="#ff4d00" />
              <div className="fc-stat-value">{trainers.length}</div>
              <div className="fc-stat-label">Total Trainers</div>
            </div>
            <div className="fc-card">
              <UserCheck color="#00c878" />
              <div className="fc-stat-value">{activeCount}</div>
              <div className="fc-stat-label">Active Trainers</div>
            </div>
            <div className="fc-card">
              <UserX color="#ff5555" />
              <div className="fc-stat-value">{inactiveCount}</div>
              <div className="fc-stat-label">Inactive Trainers</div>
            </div>
            <div className="fc-card">
              <Users color="#ffb400" />
              <div className="fc-stat-value">{totalMembers}</div>
              <div className="fc-stat-label">Assigned Members</div>
            </div>
          </div>

          <div className="fc-card">
            <div className="fc-toolbar">
              <div className="fc-search" style={{ position: "relative" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#777",
                  }}
                />
                <input
                  type="text"
                  className="fc-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search by name, email, phone or specialization..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="fc-select"
                style={{ width: 180 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="fc-table-wrap">
              <table className="fc-table">
                <thead>
                  <tr>
                    <th>Trainer</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Salary</th>
                    <th>Members</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainers.length > 0 ? (
                    filteredTrainers.map((trainer) => (
                      <tr key={trainer.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="trainer-avatar">
                              {(trainer.name || "T").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{trainer.name}</div>
                              <div style={{ fontSize: "0.8rem", color: "#888" }}>
                                {trainer.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{trainer.phone || "-"}</td>
                        <td>{trainer.specialization || "-"}</td>
                        <td>
                          {trainer.experience != null
                            ? `${trainer.experience} yrs`
                            : "-"}
                        </td>
                        <td>
                          {trainer.salary != null
                            ? `₹${Number(trainer.salary).toLocaleString()}`
                            : "-"}
                        </td>
                        <td>
                          <span className="fc-badge fc-badge-orange">
                            {trainer.assignedMemberCount || 0}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`fc-badge ${
                              trainer.status === "ACTIVE"
                                ? "fc-badge-green"
                                : "fc-badge-red"
                            }`}
                          >
                            {trainer.status}
                          </span>
                        </td>
                        <td>
                          <div className="trainer-actions">
                            <button
                              onClick={() => openViewModal(trainer)}
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => openEditModal(trainer)}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(trainer)}
                              title="Toggle Status"
                            >
                              <Power size={16} />
                            </button>
                            <button
                              className="delete-action"
                              onClick={() => handleDelete(trainer.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="fc-empty">
                        No trainers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* VIEW MODAL */}
      <Modal
        open={modalType === "view" && !!selectedTrainer}
        title="Trainer Details"
        onClose={closeModal}
      >
        {selectedTrainer && (
          <div className="trainer-details-grid">
            <div>
              <span>Name</span>
              <strong>{selectedTrainer.name}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{selectedTrainer.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{selectedTrainer.phone || "-"}</strong>
            </div>
            <div>
              <span>Specialization</span>
              <strong>{selectedTrainer.specialization || "-"}</strong>
            </div>
            <div>
              <span>Experience</span>
              <strong>{selectedTrainer.experience ?? 0} Years</strong>
            </div>
            <div>
              <span>Salary</span>
              <strong>
                {selectedTrainer.salary != null
                  ? `₹${Number(selectedTrainer.salary).toLocaleString()}`
                  : "-"}
              </strong>
            </div>
            <div>
              <span>Joining Date</span>
              <strong>{selectedTrainer.joiningDate || "-"}</strong>
            </div>
            <div>
              <span>Assigned Members</span>
              <strong>{selectedTrainer.assignedMemberCount || 0}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{selectedTrainer.status}</strong>
            </div>
          </div>
        )}
      </Modal>

      {/* ADD / EDIT MODAL */}
      <Modal
        open={modalType === "add" || modalType === "edit"}
        title={modalType === "add" ? "Add Trainer" : "Edit Trainer"}
        onClose={closeModal}
        wide
      >
        {formError && (
          <div className="fc-error" style={{ padding: 10, marginBottom: 12 }}>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="fc-grid-2" style={{ marginBottom: 16 }}>
            <div>
              <label className="fc-label">Full Name *</label>
              <input
                className="fc-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter trainer name"
                required
              />
            </div>
            <div>
              <label className="fc-label">Email *</label>
              <input
                className="fc-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="trainer@fitcore.com"
                required
              />
            </div>
            <div>
              <label className="fc-label">
                {modalType === "edit"
                  ? "New Password (leave blank to keep)"
                  : "Password *"}
              </label>
              <input
                className="fc-input"
                type="password"
                name="password"
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                required={modalType === "add"}
              />
            </div>
            <div>
              <label className="fc-label">Phone</label>
              <input
                className="fc-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="fc-label">Specialization *</label>
              <input
                className="fc-input"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Strength Training"
                required
              />
            </div>
            <div>
              <label className="fc-label">Experience (Years) *</label>
              <input
                className="fc-input"
                type="number"
                min="0"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="fc-label">Monthly Salary (₹)</label>
              <input
                className="fc-input"
                type="number"
                min="0"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="35000"
              />
            </div>
            <div>
              <label className="fc-label">Joining Date</label>
              <input
                className="fc-input"
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="fc-label">Status</label>
              <select
                className="fc-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              className="fc-btn fc-btn-ghost"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="fc-btn fc-btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : modalType === "add"
                ? "Add Trainer"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default ManageTrainers;