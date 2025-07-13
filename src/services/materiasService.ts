// services/materias.ts

import { db } from '@/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface Materia {
  id: string;
  nome: string;
  professor: string;
  emoji?: string;
  organizacaoId?: string;
}


const getUserId = (): string => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Usuário não autenticado');
  return user.uid;
};

const getMateriasCollectionRef = (organizacaoId: string) => {
  const userId = getUserId();
  return collection(db, 'users', userId, 'organizacoes', organizacaoId, 'materias');
}

export const fetchMaterias = async (organizacaoId: string): Promise<Materia[]> => {
  const snapshot = await getDocs(getMateriasCollectionRef(organizacaoId));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<Materia, 'id' | 'organizacaoId'>,
    organizacaoId
  }));
}

export const adicionarMateria = async (organizacaoId: string, nova: Omit<Materia, 'id'>) => {
  return addDoc(getMateriasCollectionRef(organizacaoId), nova);
}

export const atualizarMateria = async (organizacaoId: string, materiaId: string, dadosAtualizados: Partial<Materia>) => {
  const userId = getUserId();
  const materiaDoc = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId);
  await updateDoc(materiaDoc, dadosAtualizados);
}

export const deletarMateria = async (organizacaoId: string, materiaId: string) => {
  const userId = getUserId();
  const materiaDoc = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId);
  await deleteDoc(materiaDoc);
}

// Buscar uma matéria específica agora requer todos os IDs no caminho
export const fetchMateriaById = async (organizacaoId: string, materiaId: string): Promise<Materia | null> => {
  const userId = getUserId();
  const docRef = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Materia;
}