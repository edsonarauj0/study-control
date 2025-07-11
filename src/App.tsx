import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Button } from './components/ui/Button';
import Login from './Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

interface StudyTask {
  id: string;
  title: string;
  completed: boolean;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  // Load tasks from Firestore when user is authenticated
  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, 'tasks'));
      const data = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<StudyTask, 'id'>) }));
      setTasks(data);
    };
    fetchTasks();
  }, [user]);

  const addTask = async () => {
    if (!input.trim()) return;
    const docRef = await addDoc(collection(db, 'tasks'), {
      title: input.trim(),
      completed: false,
    });
    const newTask: StudyTask = { id: docRef.id, title: input.trim(), completed: false };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleTask = async (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;
    await updateDoc(doc(db, 'tasks', id), { completed: !target.completed });
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Study Control</h1>
          <div className="flex mb-4 gap-2">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-grow"
              placeholder="Add new task"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={addTask} className="bg-blue-500">
              Add
            </Button>
          </div>
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                </div>
                <Button
                  onClick={() => removeTask(task.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

export default App;
