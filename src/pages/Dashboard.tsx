import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Button } from '@/components/ui/Button';
import Sidebar from '@/components/sidebar/page'

interface StudyTask {
  id: string;
  title: string;
  completed: boolean;
}

function Dashboard() {
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


  return (
    <>
  
      <div className="mt-8 space-y-4">
        
      </div>
    </>

  );
}

export default Dashboard;
