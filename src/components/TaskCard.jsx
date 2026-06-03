import '../styles/taskcard.css';

function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !task.completed;
  };

  const isToday = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date().toDateString();
    const due = new Date(dueDate).toDateString();
    return today === due && !task.completed;
  };

  return (
    <div className={`task-card priority-${task.priority}`}>
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
            {isOverdue(task.dueDate) && ' (Overdue)'}
            {isToday(task.dueDate) && ' (Today)'}
          </span>
        )}
      </div>
      
      <div className="task-actions">
        {!task.completed && (
          <button onClick={() => onToggleComplete(task.id)} className="task-action-btn complete">
            ✓ Complete
          </button>
        )}
        <button onClick={() => onEdit(task)} className="task-action-btn edit">
          ✏ Edit
        </button>
        <button onClick={() => onDelete(task.id)} className="task-action-btn delete">
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;