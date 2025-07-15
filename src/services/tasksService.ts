import { db } from '@/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface Task {
  id: string;
  materiaId: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
}

const getTasksCollectionRef = (organizacaoId: string, materiaId: string) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  return collection(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'tasks');
};

export const fetchTasks = async (organizacaoId: string, materiaId: string): Promise<Task[]> => {
  const snapshot = await getDocs(getTasksCollectionRef(organizacaoId, materiaId));
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Task, 'id' | 'materiaId'>),
    materiaId,
  }));
};

export const addTask = async (organizacaoId: string, materiaId: string, title: string): Promise<Task> => {
  const docRef = await addDoc(getTasksCollectionRef(organizacaoId, materiaId), { title, status: 'todo' });
  return { id: docRef.id, materiaId, title, status: 'todo' };
};

export const updateTaskStatus = async (
  organizacaoId: string,
  materiaId: string,
  taskId: string,
  status: Task['status']
) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'tasks', taskId);
  await updateDoc(ref, { status });
};

export const deleteTask = async (organizacaoId: string, materiaId: string, taskId: string) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'tasks', taskId);
  await deleteDoc(ref);
};
