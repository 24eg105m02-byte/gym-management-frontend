import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  IndianRupee,
  Wallet,
  Clock,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import {
  getPayments,
  getPaymentStats,
  createPayment,
  updatePaymentStatus,
} from "../../services/paymentService";
import { getMembers } from "../../services/memberService";
import { getMemberships } from "../../services/membershipService";

function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
  });
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    membershipId: "",
    amount: "",
    paymentMethod: "UPI",
    transactionReference: "",
    status: "PAID",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [pList, pStats, mList, msList] = await Promise.all([
        getPayments(),
        getPaymentStats(),
        getMembers(),
        getMemberships(),
      ]);
      setPayments(pList || []);
      setStats(
        pStats || { totalRevenue: 0, monthlyRevenue: 0, pendingPayments: 0 }
      );
      setMembers(mList || []);
      setMemberships(msList || []);
    } catch (err) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (p.memberName || "").toLowerCase().includes(q) ||
        (p.transactionReference || "").toLowerCase().includes(q) ||
        (p.membershipName || "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "ALL" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const openModal = () => {
    const firstMember = members[0];
    const defaultPlan = memberships.find(
      (ms) => ms.id === firstMember?.membershipId
    );
    setFormError("");
    setFormData({
      memberId: firstMember?.id || "",
      membershipId: defaultPlan?.id || memberships[0]?.id || "",
      amount: defaultPlan?.price || memberships[0]?.price || "",
      paymentMethod: "UPI",
      transactionReference: "",
      status: "PAID",
    });
    setModalOpen(true);
  };

  const handlePlanChange = (membershipId) => {
    const plan = memberships.find((ms) => String(ms.id) === String(membershipId));
    setFormData((prev) => ({
      ...prev,
      membershipId,
      amount: plan ? plan.price : prev.amount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await createPayment({
        memberId: formData.memberId,
        membershipId: formData.membershipId || null,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        transactionReference: formData.transactionReference.trim() || null,
        status: formData.status,
      });
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || "Failed to record payment");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, nextStatus) => {
    try {
      await updatePaymentStatus(id, nextStatus);
      await loadData();
    } catch (err) {
      alert(err.message || "Failed to update payment status");
    }
  };

  const badgeClass = (status) => {
    if (status === "PAID") return "fc-badge-green";
    if (status === "PENDING") return "fc-badge-yellow";
    return "fc-badge-red";
  };

  return (
    <AdminLayout title="Manage Payments">
      <div className="fc-page-header">
        <div>
          <h1>Payments &amp; Billing</h1>
          <p>Track member payments, invoices and revenue</p>
        </div>
        <button className="fc-btn fc-btn-primary" onClick={openModal}>
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <IndianRupee color="#00c878" />
              <div className="fc-stat-value">
                ₹{Number(stats.totalRevenue || 0).toLocaleString()}
              </div>
              <div className="fc-stat-label">Total Revenue</div>
            </div>
            <div className="fc-card">
              <Wallet color="#ff4d00" />
              <div className="fc-stat-value">
                ₹{Number(stats.monthlyRevenue || 0).toLocaleString()}
              </div>
              <div className="fc-stat-label">This Month&apos;s Revenue</div>
            </div>
            <div className="fc-card">
              <Clock color="#ffb400" />
              <div className="fc-stat-value">{stats.pendingPayments || 0}</div>
              <div className="fc-stat-label">Pending Payments</div>
            </div>
            <div className="fc-card">
              <Wallet color="#3b82f6" />
              <div className="fc-stat-value">{payments.length}</div>
              <div className="fc-stat-label">Total Transactions</div>
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
                  placeholder="Search by member, plan or reference..."
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
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            <div className="fc-table-wrap">
              <table className="fc-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Member</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: "monospace", color: "#aaa" }}>
                          {p.transactionReference || "-"}
                        </td>
                        <td>
                          <strong>{p.memberName}</strong>
                        </td>
                        <td>{p.membershipName || "-"}</td>
                        <td>
                          <strong>₹{Number(p.amount).toLocaleString()}</strong>
                        </td>
                        <td>{p.paymentMethod || "-"}</td>
                        <td>
                          {p.paymentDate
                            ? new Date(p.paymentDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <span className={`fc-badge ${badgeClass(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="fc-select"
                            style={{ padding: "6px 10px", width: 120 }}
                            value={p.status}
                            onChange={(e) =>
                              handleStatusChange(p.id, e.target.value)
                            }
                          >
                            <option value="PAID">PAID</option>
                            <option value="PENDING">PENDING</option>
                            <option value="FAILED">FAILED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="fc-empty">
                        No payment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        title="Record New Payment"
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

          <div style={{ marginBottom: 14 }}>
            <label className="fc-label">Membership Plan</label>
            <select
              className="fc-select"
              value={formData.membershipId}
              onChange={(e) => handlePlanChange(e.target.value)}
            >
              <option value="">None / Custom</option>
              {memberships.map((ms) => (
                <option key={ms.id} value={ms.id}>
                  {ms.name} (₹{ms.price})
                </option>
              ))}
            </select>
          </div>

          <div className="fc-grid-2" style={{ marginBottom: 14 }}>
            <div>
              <label className="fc-label">Amount (₹) *</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="fc-input"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="fc-label">Payment Method</label>
              <select
                className="fc-select"
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
              >
                <option value="UPI">UPI</option>
                <option value="CASH">CASH</option>
                <option value="CARD">CARD</option>
                <option value="BANK_TRANSFER">BANK_TRANSFER</option>
              </select>
            </div>
          </div>

          <div className="fc-grid-2" style={{ marginBottom: 18 }}>
            <div>
              <label className="fc-label">Transaction Reference</label>
              <input
                className="fc-input"
                placeholder="Auto-generated if empty"
                value={formData.transactionReference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transactionReference: e.target.value,
                  })
                }
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
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
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
              {saving ? "Saving..." : "Record Payment"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default ManagePayments;
