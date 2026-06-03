import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/home.css';

function Home() {
  const [counters, setCounters] = useState({ users: 0, tasks: 0, satisfaction: 0 });

  useEffect(() => {
    const animateCounter = (target, field) => {
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

    animateCounter(10000, 'users');
    animateCounter(50000, 'tasks');
    animateCounter(99, 'satisfaction');
  }, []);

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to TaskFlow Pro</h1>
        <p>Organize your tasks, boost your productivity, and never miss a deadline.</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
          <Link to="/login" className="btn">Login</Link>
        </div>
      </div>

      {/* Premium Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{counters.users.toLocaleString()}+</div>
            <div className="stat-label">Happy Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{counters.tasks.toLocaleString()}+</div>
            <div className="stat-label">Tasks Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{counters.satisfaction}%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="feature">
          <h3>✅ Easy Task Management</h3>
          <p>Create, edit, and organize tasks in seconds with our intuitive interface</p>
        </div>
        <div className="feature">
          <h3>🎯 Smart Filters</h3>
          <p>Filter tasks by status - active or completed for better organization</p>
        </div>
        <div className="feature">
          <h3>🔔 Due Date Tracking</h3>
          <p>Never miss important deadlines with smart reminders and notifications</p>
        </div>
      </div>

      {/* Premium CTA Section */}
      <div className="cta-section">
        <h2>Ready to Boost Your Productivity?</h2>
        <p>Join thousands of users who trust TaskFlow Pro</p>
        <Link to="/signup" className="btn btn-primary">Start Your Free Trial</Link>
      </div>
    </div>
  );
}

export default Home;