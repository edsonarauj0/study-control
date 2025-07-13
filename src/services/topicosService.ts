// services/topicos.ts

import { db } from '@/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';

export interface Topico {
  id: string
  nome: string
  descricao: string
  // materiaId e organizacaoId não são mais necessários no documento
}

// Helper para a referência da coleção
const getTopicosCollectionRef = (organizacaoId: string, materiaId: string) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  return collection(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'topicos');
}

export const fetchTopicos = async (organizacaoId: string, materiaId: string): Promise<Topico[]> => {
  const snapshot = await getDocs(getTopicosCollectionRef(organizacaoId, materiaId));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Topico, 'id'>),
  }));
}

export const adicionarTopico = async (organizacaoId: string, materiaId: string, novo: Omit<Topico, 'id'>) => {
  return addDoc(getTopicosCollectionRef(organizacaoId, materiaId), novo);
}

export const deletarTopico = async (organizacaoId: string, materiaId: string, topicoId: string) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'topicos', topicoId);
  await deleteDoc(ref);
}

export const atualizarTopico = async (organizacaoId: string, materiaId: string, topicoId: string, dadosAtualizados: Partial<Topico>) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'topicos', topicoId);
  await updateDoc(ref, dadosAtualizados);
}

export const fetchTopicoById = async (organizacaoId: string, materiaId: string, topicoId: string): Promise<Topico | null> => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const docRef = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'topicos', topicoId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Topico;
};