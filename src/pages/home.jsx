import { Link } from "react-router-dom";
import {
  Dumbbell,
  TrendingUp,
  Users,
  CreditCard,
  ArrowRight,
  Check,
} from "lucide-react";
import "./home.css";

function Home() {
  const plans = [
    {
      name: "Basic",
      price: "999",
      features: [
        "Gym Access",
        "Basic Workout Plans",
        "Attendance Tracking",
        "Progress Tracking",
      ],
    },
    {
      name: "Premium",
      price: "1,999",
      popular: true,
      features: [
        "Everything in Basic",
        "Personal Trainer Support",
        "Custom Workout Plans",
        "Detailed Progress Reports",
      ],
    },
    {
      name: "Elite",
      price: "2,999",
      features: [
        "Everything in Premium",
        "Personal Training",
        "Nutrition Guidance",
        "Priority Support",
      ],
    },
  ];

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="home-navbar">
        <div className="home-logo">
          FIT<span>CORE</span>
        </div>

        <div className="home-nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#membership">Membership</a>
          <a href="#about">About</a>
        </div>

        <div className="home-nav-actions">
          <Link to="/login" className="login-link">
            Login
          </Link>

          <Link to="/register" className="home-join-btn">
            Join Now
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">

          <p className="hero-small-title">
            WELCOME TO FITCORE
          </p>

          <h1>
            YOUR FITNESS.
            <br />
            <span>YOUR JOURNEY.</span>
          </h1>

          <p className="hero-description">
            Train harder. Track your progress. Become the strongest
            version of yourself with FitCore.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="hero-primary-btn">
              Start Your Journey
              <ArrowRight size={18} />
            </Link>

            <a href="#features" className="hero-secondary-btn">
              Explore Features
            </a>
          </div>
        </div>

        <div className="hero-decoration">
          <Dumbbell size={260} strokeWidth={0.7} />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-heading">
          <p>WHY FITCORE?</p>
          <h2>Everything You Need To <span>Get Stronger</span></h2>
        </div>

        <div className="features-grid">

          <FeatureCard
            icon={<Dumbbell />}
            title="Workout Management"
            description="Create and manage personalized workout plans designed for your fitness goals."
          />

          <FeatureCard
            icon={<TrendingUp />}
            title="Track Progress"
            description="Monitor your workouts, attendance and fitness progress from one dashboard."
          />

          <FeatureCard
            icon={<Users />}
            title="Trainer Support"
            description="Stay connected with trainers and receive guidance throughout your journey."
          />

          <FeatureCard
            icon={<CreditCard />}
            title="Membership Management"
            description="Manage memberships, plans and payments easily in one place."
          />

        </div>
      </section>

      {/* MEMBERSHIP */}
      <section className="membership-section" id="membership">

        <div className="section-heading">
          <p>MEMBERSHIP</p>
          <h2>Choose Your <span>Plan</span></h2>
        </div>

        <div className="plans-grid">

          {plans.map((plan) => (
            <div
              className={`plan-card ${plan.popular ? "popular-plan" : ""}`}
              key={plan.name}
            >

              {plan.popular && (
                <div className="popular-badge">
                  MOST POPULAR
                </div>
              )}

              <h3>{plan.name}</h3>

              <div className="plan-price">
                <span>₹</span>
                {plan.price}
                <small>/month</small>
              </div>

              <div className="plan-divider"></div>

              <div className="plan-features">
                {plan.features.map((feature) => (
                  <div className="plan-feature" key={feature}>
                    <Check size={17} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link to="/register" className="plan-btn">
                Choose Plan
              </Link>

            </div>
          ))}

        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">

        <div className="about-content">

          <p className="about-label">ABOUT FITCORE</p>

          <h2>
            MORE THAN A GYM.
            <br />
            <span>A FITNESS COMMUNITY.</span>
          </h2>

          <p>
            FitCore is a modern gym management system designed to
            connect members, trainers and gym administrators in one
            powerful platform.
          </p>

          <p>
            From tracking attendance and workouts to managing
            memberships and monitoring progress, FitCore makes
            your entire fitness journey simple.
          </p>

          <Link to="/register" className="about-btn">
            Join FitCore
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="home-footer">

        <div className="footer-logo">
          FIT<span>CORE</span>
        </div>

        <p>
          Build your stronger self.
        </p>

        <div className="footer-line"></div>

        <p className="copyright">
          © 2026 FitCore. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <ArrowRight className="feature-arrow" size={18} />

    </div>
  );
}

export default Home;