import { useEffect, useState } from 'react';
import { Button } from './components/ui/Button';

interface StudyTask {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [input, setInput] = useState('');

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('study-tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Save tasks when they change
  useEffect(() => {
    localStorage.setItem('study-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: StudyTask = {
      id: Date.now(),
      title: input.trim(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
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
    </div>
  );
}

export default App;
