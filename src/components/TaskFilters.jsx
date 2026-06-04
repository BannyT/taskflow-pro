import '../styles/taskfilters.css';

function TaskFilters({ filter, setFilter }) {
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <div className="filters">
      {filters.map((f) => (
        <button
          key={f.id}
          className={`filter-btn ${filter === f.id ? 'active' : ''}`}
          onClick={() => setFilter(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default TaskFilters;