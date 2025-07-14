// services/atividades.ts

import { db } from '@/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { RevisionItem } from '@/lib/topicoStatus'

export interface Atividade {
  id: string
  tipo: 'aula' | 'revisao' | 'questoes'
  nome?: string
  tempo?: number
  status?: 'pendente' | 'concluido'
  total?: number
  acertos?: number
  erros?: number
  dataInicial?: string
  revisoes?: RevisionItem[]
}

// Helper para a referência da coleção
const getAtividadesCollectionRef = (organizacaoId: string, materiaId: string, topicoId: string) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  return collection(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'topicos', topicoId, 'atividades');
}


export const fetchAtividades = async (organizacaoId: string, materiaId: string, topicoId: string): Promise<Atividade[]> => {
  const snapshot = await getDocs(getAtividadesCollectionRef(organizacaoId, materiaId, topicoId));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Atividade, 'id'>),
  }));
}

export const adicionarAtividade = async (organizacaoId: string, materiaId: string, topicoId: string, nova: Omit<Atividade, 'id'>) => {
  const dataToSave = { ...nova } as Record<string, any>;
  if (nova.dataInicial instanceof Date) {
    dataToSave.dataInicial = nova.dataInicial.toISOString();
  }
  return addDoc(getAtividadesCollectionRef(organizacaoId, materiaId, topicoId), dataToSave);
}

export const deletarAtividade = async (organizacaoId: string, materiaId: string, topicoId: string, atividadeId: string) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'topicos', topicoId, 'atividades', atividadeId);
  await deleteDoc(ref);
}

export const atualizarAtividade = async (organizacaoId: string, materiaId: string, topicoId: string, atividadeId: string, dadosAtualizados: Partial<Atividade>) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'users', userId, 'organizacoes', organizacaoId, 'materias', materiaId, 'topicos', topicoId, 'atividades', atividadeId);
  await updateDoc(ref, dadosAtualizados);
}