import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import VoiceButton from '../components/VoiceCommands/VoiceButton';
import '../styles/dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleVoiceTask = (taskData) => {
    addTask(taskData);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const addTask = async (taskData) => {
    await addDoc(collection(db, 'tasks'), {
      ...taskData,
      userId: auth.currentUser.uid,
      completed: false,
      createdAt: new Date().toISOString()
    });
    setShowModal(false);
  };

  const updateTask = async (id, taskData) => {
    await updateDoc(doc(db, 'tasks', id), taskData);
    setShowModal(false);
    setEditingTask(null);
  };

  const deleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      await deleteDoc(doc(db, 'tasks', id));
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    await updateDoc(doc(db, 'tasks', id), {
      completed: !task.completed
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage your daily tasks</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <VoiceButton onTaskCreated={handleVoiceTask} />
          <button onClick={openAddModal} className="create-btn">
            + New Task
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <TaskFilters filter={filter} setFilter={setFilter} />

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started</p>
            <button onClick={openAddModal} className="empty-btn">Create Task</button>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditModal}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
            />
          ))
        )}
      </div>

      {showModal && (
        <TaskForm
          task={editingTask}
          onSave={(data) => {
            if (editingTask) {
              updateTask(editingTask.id, data);
            } else {
              addTask(data);
            }
          }}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;