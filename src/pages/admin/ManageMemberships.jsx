import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  CreditCard,
  CheckCircle2,
  XCircle,
  Power,
  Check,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import {
  getMemberships,
  createMembership,
  updateMembership,
  deleteMembership,
  toggleMembershipStatus,
} from "../../services/membershipService";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  duration: 30,
  features: "",
  status: "ACTIVE",
};

function ManageMemberships() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadPlans = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMemberships();
      setPlans(data || []);
    } catch (err) {
      setError(err.message || "Failed to load memberships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const activeCount = plans.filter((p) => p.status === "ACTIVE").length;
  const inactiveCount = plans.filter((p) => p.status === "INACTIVE").length;

  const openAdd = () => {
    setSelectedPlan(null);
    setFormData(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name || "",
      description: plan.description || "",
      price: plan.price ?? "",
      duration: plan.duration ?? 30,
      features: plan.features || "",
      status: plan.status || "ACTIVE",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      duration: Number(formData.duration),
      features: formData.features.trim(),
      status: formData.status,
    };

    try {
      if (selectedPlan) {
        const updated = await updateMembership(selectedPlan.id, payload);
        setPlans((prev) =>
          prev.map((p) => (p.id === selectedPlan.id ? updated : p))
        );
      } else {
        const created = await createMembership(payload);
        setPlans((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || "Failed to save membership plan");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (plan) => {
    try {
      const updated = await toggleMembershipStatus(plan.id);
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? updated : p)));
    } catch (err) {
      alert(err.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this membership plan?"))
      return;
    try {
      await deleteMembership(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete membership plan");
    }
  };

  return (
    <AdminLayout title="Manage Memberships">
      <div className="fc-page-header">
        <div>
          <h1>Membership Plans</h1>
          <p>Create and manage gym membership tiers and pricing</p>
        </div>
        <button className="fc-btn fc-btn-primary" onClick={openAdd}>
          <Plus size={18} />
          New Plan
        </button>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 24 }}>
            <div className="fc-card">
              <CreditCard color="#ff4d00" />
              <div className="fc-stat-value">{plans.length}</div>
              <div className="fc-stat-label">Total Plans</div>
            </div>
            <div className="fc-card">
              <CheckCircle2 color="#00c878" />
              <div className="fc-stat-value">{activeCount}</div>
              <div className="fc-stat-label">Active Plans</div>
            </div>
            <div className="fc-card">
              <XCircle color="#ff5555" />
              <div className="fc-stat-value">{inactiveCount}</div>
              <div className="fc-stat-label">Inactive Plans</div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {plans.map((plan) => {
              const featureList = (plan.features || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

              return (
                <div
                  key={plan.id}
                  className="fc-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderColor:
                      plan.status === "ACTIVE" ? "#292929" : "rgba(255,85,85,0.3)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: "1.3rem" }}>
                        {plan.name}
                      </h3>
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
                    <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: 16 }}>
                      {plan.description || "No description"}
                    </p>
                    <div style={{ marginBottom: 16 }}>
                      <span
                        style={{
                          fontSize: "2rem",
                          fontWeight: 800,
                          color: "#ff4d00",
                        }}
                      >
                        ₹{Number(plan.price).toLocaleString()}
                      </span>
                      <span style={{ color: "#777", fontSize: "0.85rem" }}>
                        {" "}
                        / {plan.duration} days
                      </span>
                    </div>

                    <div
                      style={{
                        borderTop: "1px solid #292929",
                        paddingTop: 14,
                        marginBottom: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {featureList.length > 0 ? (
                        featureList.map((f, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: "0.9rem",
                              color: "#ccc",
                            }}
                          >
                            <Check size={16} color="#00c878" />
                            <span>{f}</span>
                          </div>
                        ))
                      ) : (
                        <span style={{ color: "#666", fontSize: "0.85rem" }}>
                          Standard gym access
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="fc-btn fc-btn-ghost"
                      style={{ flex: 1 }}
                      onClick={() => openEdit(plan)}
                    >
                      <Edit size={15} />
                      Edit
                    </button>
                    <button
                      className="fc-btn fc-btn-ghost"
                      title="Toggle Status"
                      onClick={() => handleToggle(plan)}
                    >
                      <Power size={15} />
                    </button>
                    <button
                      className="fc-btn fc-btn-danger"
                      title="Delete Plan"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        title={selectedPlan ? "Edit Membership Plan" : "New Membership Plan"}
        onClose={() => setModalOpen(false)}
      >
        {formError && (
          <div className="fc-error" style={{ padding: 10, marginBottom: 12 }}>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label className="fc-label">Plan Name *</label>
            <input
              className="fc-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Platinum"
              required
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="fc-label">Description</label>
            <input
              className="fc-input"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Short summary of the plan"
            />
          </div>
          <div className="fc-grid-2" style={{ marginBottom: 14 }}>
            <div>
              <label className="fc-label">Price (₹) *</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="fc-input"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="fc-label">Duration (Days) *</label>
              <input
                type="number"
                min="1"
                className="fc-input"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="fc-label">Features (comma-separated)</label>
            <textarea
              className="fc-textarea"
              rows={3}
              value={formData.features}
              onChange={(e) =>
                setFormData({ ...formData, features: e.target.value })
              }
              placeholder="Gym access, Personal trainer, Diet plan"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
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
              {saving ? "Saving..." : selectedPlan ? "Save Changes" : "Create Plan"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default ManageMemberships;
