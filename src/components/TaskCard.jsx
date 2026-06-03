import '../styles/taskcard.css';

function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </h3>
        <span className={`priority ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        {task.dueDate && (
          <span className={`due-date ${isDueSoon(task.dueDate) ? 'soon' : ''}`}>
            📅 Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      
      <div className="task-actions">
        {!task.completed && (
          <button onClick={() => onToggleComplete(task.id)} className="complete-btn">
            ✓ Complete
          </button>
        )}
        <button onClick={() => onEdit(task)} className="edit-btn">
          ✏ Edit
        </button>
        <button onClick={() => onDelete(task.id)} className="delete-btn">
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;