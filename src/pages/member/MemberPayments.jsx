import { useEffect, useState } from "react";
import { IndianRupee, Wallet, Clock } from "lucide-react";
import MemberLayout from "../../layouts/MemberLayout";
import Loading from "../../components/Loading";
import { getPayments } from "../../services/paymentService";

function MemberPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPayments()
      .then((data) => setPayments(data || []))
      .catch((err) => setError(err.message || "Failed to load payments"))
      .finally(() => setLoading(false));
  }, []);

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const pendingAmount = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const badgeClass = (status) => {
    if (status === "PAID") return "fc-badge-green";
    if (status === "PENDING") return "fc-badge-yellow";
    return "fc-badge-red";
  };

  return (
    <MemberLayout title="My Payments">
      <div className="fc-page-header">
        <div>
          <h1>My Payments</h1>
          <p>View your membership payment history and transaction receipts</p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="fc-grid-4" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <IndianRupee color="#00c878" />
              <div className="fc-stat-value">
                ₹{totalPaid.toLocaleString()}
              </div>
              <div className="fc-stat-label">Total Paid</div>
            </div>
            <div className="fc-card">
              <Clock color="#ffb400" />
              <div className="fc-stat-value">
                ₹{pendingAmount.toLocaleString()}
              </div>
              <div className="fc-stat-label">Pending Balance</div>
            </div>
            <div className="fc-card">
              <Wallet color="#ff4d00" />
              <div className="fc-stat-value">{payments.length}</div>
              <div className="fc-stat-label">Total Transactions</div>
            </div>
          </div>

          <div className="fc-card">
            <h3 style={{ marginTop: 0 }}>Transaction History</h3>
            <div className="fc-table-wrap">
              <table className="fc-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: "monospace", color: "#aaa" }}>
                          {p.transactionReference || "-"}
                        </td>
                        <td>
                          <strong>{p.membershipName || "Membership"}</strong>
                        </td>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="fc-empty">
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
    </MemberLayout>
  );
}

export default MemberPayments;
