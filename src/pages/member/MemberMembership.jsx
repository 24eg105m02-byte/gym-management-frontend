import { useEffect, useState } from "react";
import { Check, CreditCard } from "lucide-react";
import MemberLayout from "../../layouts/MemberLayout";
import Loading from "../../components/Loading";
import { getMyProfile, updateMyProfile } from "../../services/memberService";
import { getMemberships } from "../../services/membershipService";

function MemberMembership() {
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [me, msList] = await Promise.all([
        getMyProfile(),
        getMemberships(),
      ]);
      setProfile(me);
      setPlans((msList || []).filter((p) => p.status === "ACTIVE"));
    } catch (err) {
      setError(err.message || "Failed to load membership info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubscribe = async (plan) => {
    setMessage("");
    setError("");
    setSubscribingId(plan.id);
    try {
      const updated = await updateMyProfile({ membershipId: plan.id });
      setProfile(updated);
      setMessage(
        `Successfully subscribed to ${plan.name} plan! Payment recorded.`
      );
    } catch (err) {
      setError(err.message || "Failed to subscribe to plan");
    } finally {
      setSubscribingId(null);
    }
  };

  return (
    <MemberLayout title="My Membership">
      <div className="fc-page-header">
        <div>
          <h1>My Membership</h1>
          <p>View your active subscription or upgrade your plan</p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && profile && (
        <>
          {message && (
            <div
              className="fc-card"
              style={{
                borderColor: "#00c878",
                color: "#00c878",
                marginBottom: 16,
                padding: 14,
              }}
            >
              {message}
            </div>
          )}

          <div className="fc-card" style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <CreditCard size={28} color="#ff4d00" />
                <div>
                  <h3 style={{ margin: 0 }}>
                    Current Plan:{" "}
                    <span style={{ color: "#ff4d00" }}>
                      {profile.membershipName || "None"}
                    </span>
                  </h3>
                  <p style={{ color: "#888", margin: "4px 0 0", fontSize: "0.9rem" }}>
                    {profile.membershipStartDate
                      ? `Valid from ${profile.membershipStartDate} to ${profile.membershipEndDate}`
                      : "Select a membership plan below to activate your subscription."}
                  </p>
                </div>
              </div>
              <span
                className={`fc-badge ${
                  profile.status === "ACTIVE"
                    ? "fc-badge-green"
                    : "fc-badge-red"
                }`}
              >
                {profile.status}
              </span>
            </div>
          </div>

          <h3 style={{ marginBottom: 14 }}>Available Plans</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: 20,
            }}
          >
            {plans.map((plan) => {
              const isCurrent = profile.membershipId === plan.id;
              const features = (plan.features || "")
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
                    borderColor: isCurrent ? "#ff4d00" : "#292929",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3 style={{ margin: 0 }}>{plan.name}</h3>
                      {isCurrent && (
                        <span className="fc-badge fc-badge-orange">
                          CURRENT PLAN
                        </span>
                      )}
                    </div>
                    <p style={{ color: "#888", fontSize: "0.9rem" }}>
                      {plan.description}
                    </p>
                    <div style={{ margin: "16px 0" }}>
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
                      {features.map((f, i) => (
                        <div
                          key={i}
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
                      ))}
                    </div>
                  </div>

                  <button
                    className={`fc-btn ${
                      isCurrent ? "fc-btn-ghost" : "fc-btn-primary"
                    }`}
                    onClick={() => handleSubscribe(plan)}
                    disabled={subscribingId === plan.id}
                  >
                    {subscribingId === plan.id
                      ? "Processing..."
                      : isCurrent
                      ? "Renew Plan"
                      : "Choose Plan"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </MemberLayout>
  );
}

export default MemberMembership;
