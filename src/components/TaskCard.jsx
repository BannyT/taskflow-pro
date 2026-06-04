import '../styles/taskcard.css';

function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const isOverdue = (dueDate) => {
    if (!dueDate || task.completed) return false;
    return new Date(dueDate) < new Date();
  };

  const isToday = (dueDate) => {
    if (!dueDate || task.completed) return false;
    const today = new Date().toDateString();
    const due = new Date(dueDate).toDateString();
    return today === due;
  };

  return (
    <div className="task-card">
      <div className="task-priority-bar" data-priority={task.priority}></div>
      
      <div className="task-content">
        <div className="task-header">
          <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
            {task.title}
          </h3>
          <span className={`priority-badge ${task.priority}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        <div className="task-meta">
          {task.dueDate && (
            <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''} ${isToday(task.dueDate) ? 'today' : ''}`}>
              📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {isOverdue(task.dueDate) && ' • Overdue'}
              {isToday(task.dueDate) && ' • Today'}
            </span>
          )}
        </div>
        
        <div className="task-actions">
          {!task.completed && (
            <button onClick={() => onToggleComplete(task.id)} className="action-btn complete">
              ✓ Complete
            </button>
          )}
          <button onClick={() => onEdit(task)} className="action-btn edit">
            ✏ Edit
          </button>
          <button onClick={() => onDelete(task.id)} className="action-btn delete">
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;