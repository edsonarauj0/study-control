import { db } from '@/firebase'
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'

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

export const adicionarTopico = async (novo: Omit<Topico, 'id'>) => {
  return addDoc(topicosCollection, novo)
}
