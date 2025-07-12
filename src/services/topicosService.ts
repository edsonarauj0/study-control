import { db } from '@/firebase'
import { collection, getDocs, addDoc, query, where, deleteDoc, doc, collectionGroup, updateDoc, getDoc } from 'firebase/firestore'

export interface Topico {
  id: string
  nome: string
  materiaId: string
  organizacaoId: string
  descricao: string
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

export const atualizarTopico = async (
  id: string,
  materiaId: string,
  dadosAtualizados: Partial<Topico>
) => {
  const ref = doc(db, 'materias', materiaId, 'topicos', id)
  await updateDoc(ref, dadosAtualizados)
}

export const fetchTopicoById = async (materiaId: string, topicoId: string): Promise<Topico | null> => {
  const docRef = doc(db, 'materias', materiaId, 'topicos', topicoId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      materiaId,
      ...(docSnap.data() as Omit<Topico, 'id' | 'materiaId'>),
    };
  } else {
    return null;
  }
};
