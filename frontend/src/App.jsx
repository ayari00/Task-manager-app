import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/tasks/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger les tâches
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const newTask = { title, description, done: false };
      const res = await axios.post(API_URL, newTask);
      setTasks([...tasks, res.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      alert('Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const toggleDone = async (id, currentDone) => {
    try {
      const updated = await axios.put(`${API_URL}${id}/`, {
        ...tasks.find(t => t.id === id),
        done: !currentDone
      });
      setTasks(tasks.map(t => t.id === id ? updated.data : t));
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Supprimer cette tâche ?')) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          📝 Todo App
        </h1>

        {/* Formulaire */}
        <form onSubmit={addTask} className="mb-8 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la tâche"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnelle)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="2"
          />
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
              saving ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } transition`}
          >
            {saving ? 'Ajout...' : '➕ Ajouter'}
          </button>
        </form>

        {/* Liste des tâches */}
        {loading ? (
          <div className="text-center py-6 text-gray-500">Chargement...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-6 text-gray-400">Aucune tâche 🕊️</div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`p-4 rounded-lg border flex justify-between items-start ${
                  task.done
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      task.done ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleDone(task.id, task.done)}
                    className={`p-2 rounded-full ${
                      task.done
                        ? 'text-green-600 hover:bg-green-100'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={task.done ? 'Marquer comme à faire' : 'Marquer comme terminé'}
                  >
                    {task.done ? '↩️' : '✅'}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
