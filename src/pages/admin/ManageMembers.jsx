import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  UserX,
  CreditCard,
  Power,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember as deleteMemberApi,
  toggleMemberStatus,
} from "../../services/memberService";
import { getMemberships } from "../../services/membershipService";
import { getTrainers } from "../../services/trainerService";
import "./ManageMembers.css";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  emergencyContact: "",
  membershipId: "",
  trainerId: "",
  membershipStartDate: "",
  membershipEndDate: "",
  status: "ACTIVE",
};

function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [modal, setModal] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [mList, msList, tList] = await Promise.all([
        getMembers(),
        getMemberships(),
        getTrainers(),
      ]);
      setMembers(mList || []);
      setMemberships(msList || []);
      setTrainers(tList || []);
    } catch (err) {
      setError(err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (member.name || "").toLowerCase().includes(q) ||
        (member.email || "").toLowerCase().includes(q) ||
        (member.phone || "").includes(search);

      const matchesFilter = filter === "ALL" || member.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [members, search, filter]);

  const activeCount = members.filter((m) => m.status === "ACTIVE").length;
  const inactiveCount = members.filter((m) => m.status === "INACTIVE").length;
  const subscribedCount = members.filter((m) => !!m.membershipId).length;

  const openAddModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setSelectedMember(null);
    setModal("form");
  };

  const openEditModal = (member) => {
    setFormData({
      name: member.name || "",
      email: member.email || "",
      password: "",
      phone: member.phone || "",
      gender: member.gender || "",
      dateOfBirth: member.dateOfBirth || "",
      address: member.address || "",
      emergencyContact: member.emergencyContact || "",
      membershipId: member.membershipId || "",
      trainerId: member.trainerId || "",
      membershipStartDate: member.membershipStartDate || "",
      membershipEndDate: member.membershipEndDate || "",
      status: member.status || "ACTIVE",
    });
    setFormError("");
    setSelectedMember(member);
    setModal("form");
  };

  const openViewModal = (member) => {
    setSelectedMember(member);
    setModal("view");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender || null,
      dateOfBirth: formData.dateOfBirth || null,
      address: formData.address || null,
      emergencyContact: formData.emergencyContact || null,
      membershipId: formData.membershipId ? Number(formData.membershipId) : null,
      trainerId: formData.trainerId ? Number(formData.trainerId) : null,
      membershipStartDate: formData.membershipStartDate || null,
      membershipEndDate: formData.membershipEndDate || null,
      status: formData.status,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      if (selectedMember) {
        const updated = await updateMember(selectedMember.id, payload);
        setMembers((curr) =>
          curr.map((m) => (m.id === selectedMember.id ? updated : m))
        );
      } else {
        const created = await createMember(payload);
        setMembers((curr) => [created, ...curr]);
      }
      setModal(null);
      setSelectedMember(null);
    } catch (err) {
      setFormError(err.message || "Failed to save member");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (member) => {
    try {
      const updated = await toggleMemberStatus(member.id);
      setMembers((curr) =>
        curr.map((m) => (m.id === member.id ? updated : m))
      );
    } catch (err) {
      alert(err.message || "Failed to toggle member status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMemberApi(id);
      setMembers((curr) => curr.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete member");
    }
  };

  return (
    <AdminLayout title="Manage Members">
      <div className="fc-page-header">
        <div>
          <h1>Manage Members</h1>
          <p>View and manage all FitCore members</p>
        </div>
        <button className="fc-btn fc-btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <Users color="#ff4d00" />
              <div className="fc-stat-value">{members.length}</div>
              <div className="fc-stat-label">Total Members</div>
            </div>
            <div className="fc-card">
              <UserCheck color="#00c878" />
              <div className="fc-stat-value">{activeCount}</div>
              <div className="fc-stat-label">Active</div>
            </div>
            <div className="fc-card">
              <UserX color="#ff5555" />
              <div className="fc-stat-value">{inactiveCount}</div>
              <div className="fc-stat-label">Inactive</div>
            </div>
            <div className="fc-card">
              <CreditCard color="#ffb400" />
              <div className="fc-stat-value">{subscribedCount}</div>
              <div className="fc-stat-label">With Membership</div>
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
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="fc-select"
                style={{ width: 180 }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
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
                    <th>Member</th>
                    <th>Phone</th>
                    <th>Plan</th>
                    <th>Trainer</th>
                    <th>Valid Until</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="member-table-avatar">
                              {(member.name || "M").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{member.name}</div>
                              <div style={{ fontSize: "0.8rem", color: "#888" }}>
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{member.phone || "-"}</td>
                        <td>
                          <span className="fc-badge fc-badge-orange">
                            {member.membershipName || "No Plan"}
                          </span>
                        </td>
                        <td>{member.trainerName || "Unassigned"}</td>
                        <td>{member.membershipEndDate || "-"}</td>
                        <td>
                          <span
                            className={`fc-badge ${
                              member.status === "ACTIVE"
                                ? "fc-badge-green"
                                : "fc-badge-red"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td>
                          <div className="member-actions">
                            <button
                              title="View"
                              onClick={() => openViewModal(member)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              title="Edit"
                              onClick={() => openEditModal(member)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              title="Toggle Status"
                              onClick={() => handleToggleStatus(member)}
                            >
                              <Power size={16} />
                            </button>
                            <button
                              title="Delete"
                              className="delete-action"
                              onClick={() => handleDelete(member.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="fc-empty">
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal
        open={modal === "form"}
        title={selectedMember ? "Edit Member" : "Add New Member"}
        onClose={() => setModal(null)}
        wide
      >
        {formError && (
          <div className="fc-error" style={{ padding: "10px", marginBottom: 12 }}>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="fc-grid-2" style={{ marginBottom: 16 }}>
            <div>
              <label className="fc-label">Full Name *</label>
              <input
                className="fc-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="fc-label">Email *</label>
              <input
                type="email"
                className="fc-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="fc-label">
                {selectedMember ? "New Password (leave blank to keep)" : "Password *"}
              </label>
              <input
                type="password"
                className="fc-input"
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!selectedMember}
              />
            </div>
            <div>
              <label className="fc-label">Phone</label>
              <input
                className="fc-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="fc-label">Gender</label>
              <select
                className="fc-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="fc-label">Date of Birth</label>
              <input
                type="date"
                className="fc-input"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </div>
            <div>
              <label className="fc-label">Membership Plan</label>
              <select
                className="fc-select"
                value={formData.membershipId}
                onChange={(e) =>
                  setFormData({ ...formData, membershipId: e.target.value })
                }
              >
                <option value="">No Plan</option>
                {memberships.map((ms) => (
                  <option key={ms.id} value={ms.id}>
                    {ms.name} (₹{ms.price} / {ms.duration}d)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="fc-label">Assigned Trainer</label>
              <select
                className="fc-select"
                value={formData.trainerId}
                onChange={(e) =>
                  setFormData({ ...formData, trainerId: e.target.value })
                }
              >
                <option value="">Unassigned</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialization || "General"})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="fc-label">Membership Start Date</label>
              <input
                type="date"
                className="fc-input"
                value={formData.membershipStartDate}
                onChange={(e) =>
                  setFormData({ ...formData, membershipStartDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="fc-label">Membership End Date</label>
              <input
                type="date"
                className="fc-input"
                value={formData.membershipEndDate}
                onChange={(e) =>
                  setFormData({ ...formData, membershipEndDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="fc-label">Emergency Contact</label>
              <input
                className="fc-input"
                value={formData.emergencyContact}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContact: e.target.value })
                }
              />
            </div>
            <div>
              <label className="fc-label">Status</label>
              <select
                className="fc-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="fc-label">Address</label>
            <input
              className="fc-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              className="fc-btn fc-btn-ghost"
              onClick={() => setModal(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="fc-btn fc-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : selectedMember ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW MODAL */}
      <Modal
        open={modal === "view" && !!selectedMember}
        title="Member Details"
        onClose={() => setModal(null)}
      >
        {selectedMember && (
          <div>
            <div className="member-profile-view">
              <div className="large-member-avatar">
                {(selectedMember.name || "M").charAt(0).toUpperCase()}
              </div>
              <h2 style={{ margin: "8px 0" }}>{selectedMember.name}</h2>
              <span
                className={`fc-badge ${
                  selectedMember.status === "ACTIVE"
                    ? "fc-badge-green"
                    : "fc-badge-red"
                }`}
              >
                {selectedMember.status}
              </span>
            </div>

            <div className="member-details-grid">
              <div>
                <span>Email</span>
                <strong>{selectedMember.email}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{selectedMember.phone || "-"}</strong>
              </div>
              <div>
                <span>Gender</span>
                <strong>{selectedMember.gender || "-"}</strong>
              </div>
              <div>
                <span>Date of Birth</span>
                <strong>{selectedMember.dateOfBirth || "-"}</strong>
              </div>
              <div>
                <span>Membership Plan</span>
                <strong>{selectedMember.membershipName || "None"}</strong>
              </div>
              <div>
                <span>Assigned Trainer</span>
                <strong>{selectedMember.trainerName || "Unassigned"}</strong>
              </div>
              <div>
                <span>Start Date</span>
                <strong>{selectedMember.membershipStartDate || "-"}</strong>
              </div>
              <div>
                <span>End Date</span>
                <strong>{selectedMember.membershipEndDate || "-"}</strong>
              </div>
              <div>
                <span>Emergency Contact</span>
                <strong>{selectedMember.emergencyContact || "-"}</strong>
              </div>
              <div>
                <span>Address</span>
                <strong>{selectedMember.address || "-"}</strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

export default ManageMembers;
