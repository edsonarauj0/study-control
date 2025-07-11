import { db } from '@/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, collectionGroup } from 'firebase/firestore';

// Definindo o tipo para os dados da Matéria
export interface Materia {
  id: string;
  nome: string;
  professor: string;
  organizacaoId: string;
  emoji?: string;
}

// FUNÇÃO PARA BUSCAR MATÉRIAS. PODE FILTRAR POR ORGANIZAÇÃO SE O ID FOR PASSADO
export const fetchMaterias = async (organizacaoId?: string): Promise<Materia[]> => {
  const materiasRef = organizacaoId
    ? collection(db, 'organizacoes', organizacaoId, 'materias')
    : collectionGroup(db, 'materias')
  const snapshot = await getDocs(materiasRef)
  return snapshot.docs.map(doc => {
    const data = doc.data() as Omit<Materia, 'id' | 'organizacaoId'>
    const orgId = organizacaoId ?? doc.ref.parent.parent?.id ?? ''
    return { id: doc.id, organizacaoId: orgId, ...data }
  })
}

// FUNÇÃO PARA ADICIONAR UMA NOVA MATÉRIA
export const adicionarMateria = async (novaMateria: Omit<Materia, 'id'>) => {
  const { organizacaoId, ...dados } = novaMateria
  const materiasRef = collection(db, 'organizacoes', organizacaoId, 'materias')
  const docRef = await addDoc(materiasRef, dados)
  return docRef
}

// FUNÇÃO PARA ATUALIZAR UMA MATÉRIA
export const atualizarMateria = async (
  id: string,
  organizacaoId: string,
  dadosAtualizados: Partial<Materia>
) => {
  const materiaDoc = doc(db, 'organizacoes', organizacaoId, 'materias', id)
  await updateDoc(materiaDoc, dadosAtualizados)
}

// FUNÇÃO PARA DELETAR UMA MATÉRIA
export const deletarMateria = async (id: string, organizacaoId: string) => {
  const materiaDoc = doc(db, 'organizacoes', organizacaoId, 'materias', id)
  await deleteDoc(materiaDoc)
}

export const fetchMateriaById = async (id: string): Promise<Materia | null> => {
  const q = query(collectionGroup(db, 'materias'), where('__name__', '==', id))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  const data = d.data() as Omit<Materia, 'id' | 'organizacaoId'>
  const orgId = d.ref.parent.parent?.id ?? ''
  return { id: d.id, organizacaoId: orgId, ...data }
}
