import { Link } from 'react-router-dom';
import '../styles/home.css';

function Home() {
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
      <div className="features">
        <div className="feature">
          <h3>✅ Easy Task Management</h3>
          <p>Create, edit, and organize tasks in seconds</p>
        </div>
        <div className="feature">
          <h3>🎯 Smart Filters</h3>
          <p>Filter tasks by status - active or completed</p>
        </div>
        <div className="feature">
          <h3>🔔 Due Date Tracking</h3>
          <p>Never miss important deadlines</p>
        </div>
      </div>
    </div>
  );
}

export default Home;