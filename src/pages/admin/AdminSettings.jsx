import { useEffect, useState } from "react";
import { Save, Lock, User } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Loading from "../../components/Loading";
import { getMe, updateAccount } from "../../services/authService";
import { getCurrentUser, getToken, saveAuthSession } from "../../utils/auth";

function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "ADMIN",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const cached = getCurrentUser();
    if (cached) {
      setProfile({
        name: cached.name || "",
        email: cached.email || "",
        phone: cached.phone || "",
        role: cached.role || "ADMIN",
      });
    }
    getMe()
      .then((u) => {
        setProfile({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          role: u.role || "ADMIN",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSavingProfile(true);
    try {
      const updated = await updateAccount({
        name: profile.name,
        phone: profile.phone,
      });
      saveAuthSession(getToken(), updated, true);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (passwords.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSavingPwd(true);
    try {
      await updateAccount({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage("Password updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="fc-page-header">
        <div>
          <h1>Account Settings</h1>
          <p>Manage your administrator profile and security preferences</p>
        </div>
      </div>

      {loading && <Loading />}

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
          {error && (
            <div
              className="fc-card"
              style={{
                borderColor: "#ff5555",
                color: "#ff5555",
                marginBottom: 16,
                padding: 14,
              }}
            >
              {error}
            </div>
          )}

          <div className="fc-grid-2">
            <div className="fc-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <User color="#ff4d00" size={20} />
                <h3 style={{ margin: 0 }}>Profile Information</h3>
              </div>
              <form onSubmit={handleSaveProfile}>
                <div style={{ marginBottom: 14 }}>
                  <label className="fc-label">Full Name</label>
                  <input
                    className="fc-input"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="fc-label">Email Address</label>
                  <input
                    className="fc-input"
                    value={profile.email}
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="fc-label">Phone Number</label>
                  <input
                    className="fc-input"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label className="fc-label">Role</label>
                  <input
                    className="fc-input"
                    value={profile.role}
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                </div>
                <button
                  type="submit"
                  className="fc-btn fc-btn-primary"
                  disabled={savingProfile}
                >
                  <Save size={16} />
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>

            <div className="fc-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <Lock color="#ff4d00" size={20} />
                <h3 style={{ margin: 0 }}>Change Password</h3>
              </div>
              <form onSubmit={handleSavePassword}>
                <div style={{ marginBottom: 14 }}>
                  <label className="fc-label">Current Password</label>
                  <input
                    type="password"
                    className="fc-input"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="fc-label">New Password</label>
                  <input
                    type="password"
                    className="fc-input"
                    minLength={6}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label className="fc-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="fc-input"
                    minLength={6}
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="fc-btn fc-btn-primary"
                  disabled={savingPwd}
                >
                  <Lock size={16} />
                  {savingPwd ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminSettings;
