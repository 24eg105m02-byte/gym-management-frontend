import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import MemberLayout from "../../layouts/MemberLayout";
import Loading from "../../components/Loading";
import { getMyProfile, updateMyProfile } from "../../services/memberService";

function MemberProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: "",
  });

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "",
          address: data.address || "",
          emergencyContact: data.emergencyContact || "",
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
      const updated = await updateMyProfile({
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address || null,
        emergencyContact: formData.emergencyContact || null,
      });
      setProfile(updated);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MemberLayout title="My Profile">
      <div className="fc-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information and emergency contact</p>
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

          <div className="fc-card" style={{ maxWidth: 680 }}>
            <form onSubmit={handleSubmit}>
              <div className="fc-grid-2" style={{ marginBottom: 14 }}>
                <div>
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
                <div>
                  <label className="fc-label">Email Address</label>
                  <input
                    className="fc-input"
                    value={profile.email || ""}
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                </div>
                <div>
                  <label className="fc-label">Phone Number</label>
                  <input
                    className="fc-input"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
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
                  <label className="fc-label">Gender</label>
                  <select
                    className="fc-select"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="fc-label">Emergency Contact</label>
                  <input
                    className="fc-input"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="fc-label">Address</label>
                <input
                  className="fc-input"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="fc-btn fc-btn-primary"
                disabled={saving}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </>
      )}
    </MemberLayout>
  );
}

export default MemberProfile;
