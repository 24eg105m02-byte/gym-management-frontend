import { useEffect, useState } from "react";
import { Save, Award, Users } from "lucide-react";
import TrainerLayout from "../../layouts/TrainerLayout";
import Loading from "../../components/Loading";
import {
  getMyTrainerProfile,
  updateMyTrainerProfile,
} from "../../services/trainerService";

function TrainerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    experience: 0,
  });

  useEffect(() => {
    getMyTrainerProfile()
      .then((data) => {
        setProfile(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          specialization: data.specialization || "",
          experience: data.experience ?? 0,
        });
      })
      .catch((err) => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const updated = await updateMyTrainerProfile({
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        experience: Number(formData.experience),
      });
      setProfile(updated);
      setMessage("Trainer profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <TrainerLayout title="My Profile">
      <div className="fc-page-header">
        <div>
          <h1>My Trainer Profile</h1>
          <p>Update your professional details and specialization</p>
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

          <div className="fc-grid-2">
            <div className="fc-card">
              <h3 style={{ marginTop: 0 }}>Edit Profile</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label className="fc-label">Full Name *</label>
                  <input
                    className="fc-input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="fc-label">Email</label>
                  <input
                    className="fc-input"
                    value={profile.email || ""}
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="fc-label">Phone</label>
                  <input
                    className="fc-input"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="fc-label">Specialization</label>
                  <input
                    className="fc-input"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label className="fc-label">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    className="fc-input"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="fc-btn fc-btn-primary"
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="fc-card">
                <Users color="#ff4d00" />
                <div className="fc-stat-value">
                  {profile.assignedMemberCount ?? 0}
                </div>
                <div className="fc-stat-label">Currently Assigned Members</div>
              </div>
              <div className="fc-card">
                <Award color="#00c878" />
                <div style={{ marginTop: 12 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span className="fc-label">Joining Date</span>
                    <strong>{profile.joiningDate || "-"}</strong>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span className="fc-label">Monthly Salary</span>
                    <strong>
                      {profile.salary != null
                        ? `₹${Number(profile.salary).toLocaleString()}`
                        : "-"}
                    </strong>
                  </div>
                  <div>
                    <span className="fc-label">Status</span>
                    <span className="fc-badge fc-badge-green">
                      {profile.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </TrainerLayout>
  );
}

export default TrainerProfile;
