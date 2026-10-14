import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { login as loginApi } from "../services/authService";
import { getRoleHome, saveAuthSession } from "../utils/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginApi(formData.email.trim(), formData.password);
      saveAuthSession(data.token, data.user, rememberMe);
      navigate(getRoleHome(data.user.role));
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <Link to="/" className="login-back">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        <div className="login-brand">
          <Dumbbell size={34} />
          <span>
            FIT<span>CORE</span>
          </span>
        </div>
        <div className="login-message">
          <p>WELCOME BACK</p>
          <h1>
            BUILD.
            <br />
            <span>GRIND.</span>
            <br />
            REPEAT.
          </h1>
          <p className="login-description">
            Continue your fitness journey and keep pushing towards your goals.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <div className="mobile-logo">
            FIT<span>CORE</span>
          </div>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Login to your FitCore account</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="forgot-password">
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="register-text">
            Don&apos;t have an account?
            <Link to="/register">Create Account</Link>
          </div>

          <div className="demo-accounts">
            <p>DEMO ACCOUNTS</p>
            <div>
              <strong>Admin:</strong> admin@fitcore.com / admin123
            </div>
            <div>
              <strong>Trainer:</strong> trainer@fitcore.com / trainer123
            </div>
            <div>
              <strong>Member:</strong> member@fitcore.com / member123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
