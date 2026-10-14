import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import TrainerLayout from "../../layouts/TrainerLayout";
import Loading from "../../components/Loading";
import { getFeedback } from "../../services/feedbackService";

function TrainerFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeedback()
      .then((data) => setFeedback(data || []))
      .catch((err) => setError(err.message || "Failed to load feedback"))
      .finally(() => setLoading(false));
  }, []);

  const avgRating =
    feedback.length > 0
      ? (
          feedback.reduce((sum, f) => sum + Number(f.rating || 0), 0) /
          feedback.length
        ).toFixed(1)
      : "0.0";

  return (
    <TrainerLayout title="Member Feedback">
      <div className="fc-page-header">
        <div>
          <h1>Member Feedback</h1>
          <p>Reviews and ratings from your assigned members</p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <div className="fc-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="fc-grid-2" style={{ marginBottom: 20 }}>
            <div className="fc-card">
              <Star color="#ffb400" />
              <div className="fc-stat-value">{avgRating} / 5.0</div>
              <div className="fc-stat-label">Average Rating</div>
            </div>
            <div className="fc-card">
              <MessageSquare color="#ff4d00" />
              <div className="fc-stat-value">{feedback.length}</div>
              <div className="fc-stat-label">Total Reviews</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {feedback.length > 0 ? (
              feedback.map((fb) => (
                <div key={fb.id} className="fc-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <strong>{fb.memberName}</strong>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#ffb400",
                      }}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          fill={i < fb.rating ? "#ffb400" : "transparent"}
                          color="#ffb400"
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: "#ccc", margin: "6px 0 8px" }}>
                    {fb.comment || "No comment provided."}
                  </p>
                  <small style={{ color: "#666" }}>
                    {fb.createdAt
                      ? new Date(fb.createdAt).toLocaleDateString()
                      : ""}
                  </small>
                </div>
              ))
            ) : (
              <div className="fc-card fc-empty">
                No feedback received yet.
              </div>
            )}
          </div>
        </>
      )}
    </TrainerLayout>
  );
}

export default TrainerFeedback;
