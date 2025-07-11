import { db } from '@/firebase'
import { collection, getDocs, addDoc, query, where, deleteDoc, doc, collectionGroup } from 'firebase/firestore'

export interface Topico {
  id: string
  nome: string
  materiaId: string
}

const topicosCollection = (materiaId: string) =>
  collection(db, 'materias', materiaId, 'topicos')

export const fetchTopicos = async (materiaId: string): Promise<Topico[]> => {
  const snapshot = await getDocs(topicosCollection(materiaId))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    materiaId,
    ...(doc.data() as Omit<Topico, 'id' | 'materiaId'>),
  }))
}

export const fetchTodosTopicos = async (): Promise<Topico[]> => {
  const snapshot = await getDocs(collectionGroup(db, 'topicos'))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    materiaId: doc.ref.parent.parent?.id ?? '',
    ...(doc.data() as Omit<Topico, 'id' | 'materiaId'>),
  }))
}

export const adicionarTopico = async (novo: Omit<Topico, 'id'>) => {
  const { materiaId, ...dados } = novo
  return addDoc(topicosCollection(materiaId), dados)
}

export const deletarTopico = async (id: string, materiaId: string) => {
  const ref = doc(db, 'materias', materiaId, 'topicos', id)
  await deleteDoc(ref)
}
