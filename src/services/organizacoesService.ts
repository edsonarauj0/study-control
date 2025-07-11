import { db } from '@/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

export interface Organizacao {
  id: string
  nome: string
}

const organizacoesCollection = collection(db, 'organizacoes')

export const fetchOrganizacoes = async (): Promise<Organizacao[]> => {
  const snapshot = await getDocs(organizacoesCollection)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Organizacao, 'id'>),
  }))
}

export const adicionarOrganizacao = async (nova: Omit<Organizacao, 'id'>) => {
  return addDoc(organizacoesCollection, nova)
}

export const deletarOrganizacao = async (id: string) => {
  const ref = doc(db, 'organizacoes', id)
  await deleteDoc(ref)
}
