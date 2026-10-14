import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { register as registerApi } from "../services/authService";
import { saveAuthSession } from "../utils/auth";
import "./register.css";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword, terms } = formData;

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!terms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerApi({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      saveAuthSession(data.token, data.user);
      navigate("/member");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <Link to="/" className="register-back">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        <div className="register-brand">
          <Dumbbell size={34} />
          <span>
            FIT<span>CORE</span>
          </span>
        </div>
        <div className="register-message">
          <p>JOIN FITCORE</p>
          <h1>
            START YOUR
            <br />
            <span>FITNESS JOURNEY</span>
          </h1>
          <p className="register-description">
            Create your member account and track workouts, attendance, and progress.
          </p>
        </div>
      </div>

      <div className="register-right">
        <div className="register-box">
          <h2>Create Account</h2>
          <p className="register-subtitle">Register as a FitCore member</p>
          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <label className="remember" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
              <span>I accept the terms and conditions</span>
            </label>
            <button type="submit" className="register-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="login-text">
            Already have an account?
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
