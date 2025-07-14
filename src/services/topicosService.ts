// services/topicos.ts

import { db } from '@/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';

export interface Topico {
  id: string
  nome: string
  descricao: string
  status: 'success' | 'failed' | 'processing'
  learning: { completed_at: string | null }
  review: { review_count: number }
  questions: { total_attempted: number; correct_answers: number; sessions: any[] }
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

export const adicionarTopico = async (
  organizacaoId: string,
  materiaId: string,
  novo: Omit<Topico, 'id'>
) => {
  return addDoc(getTopicosCollectionRef(organizacaoId, materiaId), {
    ...novo,
    descricao: novo.descricao || '',
    status: novo.status || 'processing',
    learning: novo.learning || { completed_at: null },
    review: novo.review || { review_count: 0 },
    questions: novo.questions || { total_attempted: 0, correct_answers: 0, sessions: [] },
  });
};

export const deletarTopico = async (organizacaoId: string, materiaId: string, topicoId: string) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'topicos', topicoId);
  await deleteDoc(ref);
}

export const atualizarTopico = async (
  organizacaoId: string,
  materiaId: string,
  topicoId: string,
  dadosAtualizados: Partial<Topico>
) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(
    db,
    'users',
    userId,
    'organizacoes',
    organizacaoId,
    'materias',
    materiaId,
    'topicos',
    topicoId
  );
  await updateDoc(ref, {
    ...dadosAtualizados,
    descricao: dadosAtualizados.descricao || '',
    status: dadosAtualizados.status || 'processing',
  });
};

export const fetchTopicoById = async (organizacaoId: string, materiaId: string, topicoId: string): Promise<Topico | null> => {
  debugger
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const docRef = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'topicos', topicoId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Topico;
};