import { db } from '@/firebase'
import { collection, getDocs, addDoc, query, where, deleteDoc, doc } from 'firebase/firestore'

export interface Topico {
  id: string
  nome: string
  materiaId: string
}

const topicosCollection = collection(db, 'topicos')

export const fetchTopicos = async (materiaId: string): Promise<Topico[]> => {
  const q = query(topicosCollection, where('materiaId', '==', materiaId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Topico, 'id'>),
  }))
}

export const fetchTodosTopicos = async (): Promise<Topico[]> => {
  const snapshot = await getDocs(topicosCollection)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Topico, 'id'>),
  }))
}

export const adicionarTopico = async (novo: Omit<Topico, 'id'>) => {
  return addDoc(topicosCollection, novo)
}

export const deletarTopico = async (id: string) => {
  const ref = doc(db, 'topicos', id)
  await deleteDoc(ref)
}
