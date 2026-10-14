import { useEffect, useState } from "react";
import { UserRoundCheck, Star, Send } from "lucide-react";
import MemberLayout from "../../layouts/MemberLayout";
import Loading from "../../components/Loading";
import { getMyAssignedTrainer, getTrainers } from "../../services/trainerService";
import { getFeedback, createFeedback } from "../../services/feedbackService";
import { updateMyProfile } from "../../services/memberService";

function MemberTrainer() {
  const [trainer, setTrainer] = useState(null);
  const [allTrainers, setAllTrainers] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [myTr, fbList, trList] = await Promise.all([
        getMyAssignedTrainer(),
        getFeedback(),
        getTrainers().catch(() => []),
      ]);
      setTrainer(myTr && myTr.id ? myTr : null);
      setFeedbackList(fbList || []);
      setAllTrainers((trList || []).filter((t) => t.status === "ACTIVE"));
    } catch (err) {
      setError(err.message || "Failed to load trainer info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignTrainer = async (trainerId) => {
    setMessage("");
    setError("");
    try {
<<<<<<< HEAD
      await updateMyProfile({ trainerId });
=======
      await updateMyProfile({ trainerId: Number(trainerId) });
>>>>>>> ed4e94e646ea6516796b51466645c4c2bb71395c
      setMessage("Trainer assigned successfully!");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to assign trainer");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!trainer) return;
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const created = await createFeedback({
        trainerId: trainer.id,
        rating: Number(rating),
        comment: comment.trim(),
      });
      setFeedbackList((prev) => [created, ...prev]);
      setComment("");
      setRating(5);
      setMessage("Thank you! Your feedback has been submitted.");
    } catch (err) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MemberLayout title="My Trainer">
      <div className="fc-page-header">
        <div>
          <h1>My Personal Trainer</h1>
          <p>View your coach&apos;s details and share feedback</p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && (
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

          <div className="fc-grid-2" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <UserRoundCheck color="#ff4d00" size={24} />
                <h3 style={{ margin: 0 }}>Assigned Trainer</h3>
              </div>

              {trainer ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <span className="fc-label">Name</span>
                    <strong style={{ fontSize: "1.1rem" }}>{trainer.name}</strong>
                  </div>
                  <div>
                    <span className="fc-label">Specialization</span>
                    <span className="fc-badge fc-badge-orange">
                      {trainer.specialization || "General Fitness"}
                    </span>
                  </div>
                  <div>
                    <span className="fc-label">Experience</span>
                    <strong>{trainer.experience ?? 0} Years</strong>
                  </div>
                  <div>
                    <span className="fc-label">Email</span>
                    <strong>{trainer.email}</strong>
                  </div>
                  <div>
                    <span className="fc-label">Phone</span>
                    <strong>{trainer.phone || "-"}</strong>
                  </div>
                </div>
              ) : (
                <div className="fc-empty" style={{ padding: "20px 0" }}>
                  <p>You do not have a trainer assigned yet.</p>
                </div>
              )}

              {allTrainers.length > 0 && (
                <div
                  style={{
                    borderTop: "1px solid #292929",
                    marginTop: 16,
                    paddingTop: 14,
                  }}
                >
                  <label className="fc-label">
                    {trainer ? "Switch Trainer" : "Select a Trainer"}
                  </label>
                  <select
                    className="fc-select"
                    value={trainer?.id || ""}
                    onChange={(e) => {
                      if (e.target.value) handleAssignTrainer(e.target.value);
                    }}
                  >
                    <option value="">Choose Trainer...</option>
                    {allTrainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.specialization || "Fitness"} (
                        {t.experience ?? 0} yrs)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Rate &amp; Review Your Trainer</h3>
              {trainer ? (
                <form onSubmit={handleFeedbackSubmit}>
                  <div style={{ marginBottom: 14 }}>
                    <label className="fc-label">Rating (1 to 5 Stars)</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={{
                            background: "transparent",
                            border: "1px solid #292929",
                            borderRadius: 8,
                            padding: "8px 12px",
                            cursor: "pointer",
                            color: star <= rating ? "#ffb400" : "#555",
                          }}
                        >
                          <Star
                            size={18}
                            fill={star <= rating ? "#ffb400" : "transparent"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label className="fc-label">Your Feedback</label>
                    <textarea
                      className="fc-textarea"
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with your trainer..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="fc-btn fc-btn-primary"
                    disabled={submitting}
                  >
                    <Send size={16} />
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </form>
              ) : (
                <div className="fc-empty">
                  Assign a trainer first to submit feedback.
                </div>
              )}
            </div>
          </div>

          <div className="fc-card">
            <h3 style={{ marginTop: 0 }}>My Past Feedback</h3>
            {feedbackList.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {feedbackList.map((fb) => (
                  <div
                    key={fb.id}
                    style={{
                      borderBottom: "1px solid #292929",
                      paddingBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <strong>Trainer: {fb.trainerName}</strong>
                      <span style={{ color: "#ffb400", fontWeight: 700 }}>
                        ★ {fb.rating} / 5
                      </span>
                    </div>
                    <p style={{ color: "#ccc", margin: "4px 0" }}>
                      {fb.comment}
                    </p>
                    <small style={{ color: "#666" }}>
                      {fb.createdAt
                        ? new Date(fb.createdAt).toLocaleDateString()
                        : ""}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="fc-empty">No feedback submitted yet.</div>
            )}
          </div>
        </>
      )}
    </MemberLayout>
  );
}

export default MemberTrainer;
