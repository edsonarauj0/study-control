import { db } from '@/firebase'
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'

export interface Atividade {
  id: string
  nome: string
  topicoId: string
}

const atividadesCollection = collection(db, 'atividades')

export const fetchAtividades = async (topicoId: string): Promise<Atividade[]> => {
  const q = query(atividadesCollection, where('topicoId', '==', topicoId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Atividade, 'id'>),
  }))
}

export const adicionarAtividade = async (nova: Omit<Atividade, 'id'>) => {
  return addDoc(atividadesCollection, nova)
}
