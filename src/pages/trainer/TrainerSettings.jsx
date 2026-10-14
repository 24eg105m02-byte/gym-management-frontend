import { useState } from "react";
import { Lock } from "lucide-react";
import TrainerLayout from "../../layouts/TrainerLayout";
import { updateAccount } from "../../services/authService";

function TrainerSettings() {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
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
    setSaving(true);
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
      setSaving(false);
    }
  };

  return (
    <TrainerLayout title="Settings">
      <div className="fc-page-header">
        <div>
          <h1>Account Security</h1>
          <p>Change your account password</p>
        </div>
      </div>

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

      <div className="fc-card" style={{ maxWidth: 520 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
          }}
        >
          <Lock color="#ff4d00" size={20} />
          <h3 style={{ margin: 0 }}>Change Password</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label className="fc-label">Current Password</label>
            <input
              type="password"
              className="fc-input"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
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
                setPasswords({ ...passwords, newPassword: e.target.value })
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
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="fc-btn fc-btn-primary"
            disabled={saving}
          >
            <Lock size={16} />
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </TrainerLayout>
  );
}

export default TrainerSettings;
