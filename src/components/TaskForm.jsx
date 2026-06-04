import { useState, useEffect } from 'react';
import '../styles/taskform.css';

function TaskForm({ task, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate || ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add details..."
                rows="3"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">{task ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;