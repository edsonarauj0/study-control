import { db } from '@/firebase'
import { collection, getDocs, addDoc, query, where, deleteDoc, doc, collectionGroup, updateDoc } from 'firebase/firestore'

export interface Atividade {
  id: string
  nome: string
  topicoId: string
}

const atividadesCollection = (topicoId: string) =>
  collection(db, 'topicos', topicoId, 'atividades')

export const fetchAtividades = async (topicoId: string): Promise<Atividade[]> => {
  const snapshot = await getDocs(atividadesCollection(topicoId))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    topicoId,
    ...(doc.data() as Omit<Atividade, 'id' | 'topicoId'>),
  }))
}

export const fetchTodasAtividades = async (): Promise<Atividade[]> => {
  const snapshot = await getDocs(collectionGroup(db, 'atividades'))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    topicoId: doc.ref.parent.parent?.id ?? '',
    ...(doc.data() as Omit<Atividade, 'id' | 'topicoId'>),
  }))
}

export const adicionarAtividade = async (nova: Omit<Atividade, 'id'>) => {
  const { topicoId, ...dados } = nova
  return addDoc(atividadesCollection(topicoId), dados)
}

export const deletarAtividade = async (id: string, topicoId: string) => {
  const ref = doc(db, 'topicos', topicoId, 'atividades', id)
  await deleteDoc(ref)
}

export const atualizarAtividade = async (
  id: string,
  topicoId: string,
  dadosAtualizados: Partial<Atividade>
) => {
  const ref = doc(db, 'topicos', topicoId, 'atividades', id)
  await updateDoc(ref, dadosAtualizados)
}
