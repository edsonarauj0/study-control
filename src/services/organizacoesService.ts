// services/organizacoes.ts

import { db } from '@/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export interface Organizacao {
  id: string
  nome: string
}

// Modifique para aceitar um userId opcional
const getOrganizacoesCollectionRef = (userId: string) => {
  if (!userId) throw new Error('ID do usuário não fornecido');
  return collection(db, 'users', userId, 'organizacoes');
}

// Modifique adicionarOrganizacao para usar o userId fornecido
export const adicionarOrganizacao = async (
  nova: Omit<Organizacao, 'id'>, 
  userId: string
) => {
  // Agora a função exige explicitamente o userId
  // Isso a torna mais segura e previsível
  return addDoc(getOrganizacoesCollectionRef(userId), nova);
}

export const fetchOrganizacoes = async (): Promise<Organizacao[]> => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) return []; // Retorna array vazio se não houver usuário

  const snapshot = await getDocs(getOrganizacoesCollectionRef(userId));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Organizacao, 'id'>),
  }));
}

export const deletarOrganizacao = async (id: string) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'users', userId, 'organizacoes', id);
  await deleteDoc(ref);
}

export const atualizarOrganizacao = async (
  id: string,
  dadosAtualizados: Partial<Organizacao>
) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'users', userId, 'organizacoes', id);
  await updateDoc(ref, dadosAtualizados);
}

export const fetchOrganizacaoTree = async (organizacaoId: string): Promise<any> => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');

  const ref = doc(db, 'users', userId, 'organizacoes', organizacaoId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error('Organização não encontrada');
  }

  return snapshot.data();
};