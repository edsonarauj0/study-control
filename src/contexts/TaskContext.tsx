import { createContext, useContext, useState, ReactNode } from 'react';
import { Task, fetchTasks, addTask, updateTaskStatus, deleteTask } from '@/services/tasksService';

interface TaskContextValue {
  tasks: Task[];
  loadTasks: (orgId: string, materiaId: string) => Promise<void>;
  createTask: (orgId: string, materiaId: string, title: string) => Promise<void>;
  setTaskStatus: (orgId: string, materiaId: string, id: string, status: Task['status']) => Promise<void>;
  removeTask: (orgId: string, materiaId: string, id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async (orgId: string, materiaId: string) => {
    const data = await fetchTasks(orgId, materiaId);
    setTasks(data);
  };

  const createTask = async (orgId: string, materiaId: string, title: string) => {
    const newTask = await addTask(orgId, materiaId, title);
    setTasks(prev => [...prev, newTask]);
  };

  const setTaskStatus = async (
    orgId: string,
    materiaId: string,
    id: string,
    status: Task['status']
  ) => {
    await updateTaskStatus(orgId, materiaId, id, status);
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  };

  const removeTask = async (orgId: string, materiaId: string, id: string) => {
    await deleteTask(orgId, materiaId, id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, loadTasks, createTask, setTaskStatus, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
