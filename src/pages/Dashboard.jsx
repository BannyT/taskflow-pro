import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import '../styles/dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  const addTask = async (taskData) => {
    try {
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId: auth.currentUser.uid,
        completed: false,
        createdAt: new Date().toISOString()
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, taskData);
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    try {
      await updateDoc(doc(db, 'tasks', id), {
        completed: !task.completed
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return <div className="loading">Loading your tasks...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Tasks</h1>
          <button onClick={() => setShowForm(true)} className="add-task-btn">
            + Add New Task
          </button>
        </div>

        <TaskFilters filter={filter} setFilter={setFilter} />

        <div className="tasks-grid">
          {filteredTasks.length === 0 ? (
            <div className="no-tasks">
              No tasks found. Click "Add New Task" to get started!
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => {
                  setEditingTask(task);
                  setShowForm(true);
                }}
                onDelete={deleteTask}
                onToggleComplete={toggleComplete}
              />
            ))
          )}
        </div>

        {showForm && (
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
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;