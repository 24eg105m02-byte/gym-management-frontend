import { useEffect, useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import TrainerLayout from "../../layouts/TrainerLayout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import { getMembers } from "../../services/memberService";
import { getAttendancePercentage } from "../../services/attendanceService";

function TrainerMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [attPercent, setAttPercent] = useState(null);

  useEffect(() => {
    getMembers()
      .then((data) => setMembers(data || []))
      .catch((err) => setError(err.message || "Failed to load members"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter(
      (m) =>
        (m.name || "").toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q) ||
        (m.phone || "").includes(search)
    );
  }, [members, search]);

  const openDetails = async (member) => {
    setSelected(member);
    setAttPercent(null);
    try {
      const res = await getAttendancePercentage(member.id);
      setAttPercent(res?.percentage ?? 0);
    } catch {
      setAttPercent(0);
    }
  };

  return (
    <TrainerLayout title="My Members">
      <div className="fc-page-header">
        <div>
          <h1>My Assigned Members</h1>
          <p>View and track members under your coaching</p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
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
                placeholder="Search assigned members by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="fc-table-wrap">
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Plan</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div>
                          <strong>{m.name}</strong>
                          <div style={{ fontSize: "0.8rem", color: "#888" }}>
                            {m.email}
                          </div>
                        </div>
                      </td>
                      <td>{m.phone || "-"}</td>
                      <td>{m.gender || "-"}</td>
                      <td>
                        <span className="fc-badge fc-badge-orange">
                          {m.membershipName || "No Plan"}
                        </span>
                      </td>
                      <td>{m.membershipEndDate || "-"}</td>
                      <td>
                        <span
                          className={`fc-badge ${
                            m.status === "ACTIVE"
                              ? "fc-badge-green"
                              : "fc-badge-red"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="fc-btn fc-btn-ghost"
                          style={{ padding: "6px 10px" }}
                          onClick={() => openDetails(m)}
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="fc-empty">
                      No assigned members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={!!selected}
        title="Member Details"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="fc-grid-2">
            <div>
              <span className="fc-label">Name</span>
              <strong>{selected.name}</strong>
            </div>
            <div>
              <span className="fc-label">Email</span>
              <strong>{selected.email}</strong>
            </div>
            <div>
              <span className="fc-label">Phone</span>
              <strong>{selected.phone || "-"}</strong>
            </div>
            <div>
              <span className="fc-label">Gender</span>
              <strong>{selected.gender || "-"}</strong>
            </div>
            <div>
              <span className="fc-label">Date of Birth</span>
              <strong>{selected.dateOfBirth || "-"}</strong>
            </div>
            <div>
              <span className="fc-label">Membership Plan</span>
              <strong>{selected.membershipName || "None"}</strong>
            </div>
            <div>
              <span className="fc-label">Attendance Rate</span>
              <strong style={{ color: "#ff4d00" }}>
                {attPercent !== null ? `${attPercent}%` : "Calculating..."}
              </strong>
            </div>
            <div>
              <span className="fc-label">Emergency Contact</span>
              <strong>{selected.emergencyContact || "-"}</strong>
            </div>
          </div>
        )}
      </Modal>
    </TrainerLayout>
  );
}

export default TrainerMembers;
