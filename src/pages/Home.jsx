import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/home.css';

function Home() {
  const [counters, setCounters] = useState({ users: 0, tasks: 0 });

  useEffect(() => {
    const animate = (target, field) => {
      let start = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCounters(prev => ({ ...prev, [field]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [field]: Math.floor(start) }));
        }
      }, 20);
    };
    animate(15000, 'users');
    animate(250000, 'tasks');
  }, []);

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>Task Management Reimagined</span>
        </div>
        <h1>
          Organize your<br />
          <span className="text-orange">work, simply.</span>
        </h1>
        <p>The minimalist task manager that helps you focus on what matters.</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <div className="stat-number">{counters.users.toLocaleString()}+</div>
          <div className="stat-label">Users</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-number">{counters.tasks.toLocaleString()}+</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
      </div>

      <div className="features">
        <div className="feature">
          <div className="feature-icon">✓</div>
          <h3>Simple Tasks</h3>
          <p>Create and manage tasks with a clean, distraction-free interface.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🎯</div>
          <h3>Smart Filters</h3>
          <p>Filter by status to focus on what needs attention.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">📅</div>
          <h3>Due Dates</h3>
          <p>Never miss deadlines with clear due date tracking.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;