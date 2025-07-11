import { db } from '@/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// Definindo o tipo para os dados da Matéria
export interface Materia {
  id: string;
  nome: string;
  professor: string;
  organizacaoId: string;
}

// Referência para a coleção "materias"
const materiasCollectionRef = collection(db, 'materias');

// FUNÇÃO PARA BUSCAR MATÉRIAS. PODE FILTRAR POR ORGANIZAÇÃO SE O ID FOR PASSADO
export const fetchMaterias = async (organizacaoId?: string): Promise<Materia[]> => {
  const materiasQuery = organizacaoId
    ? query(materiasCollectionRef, where('organizacaoId', '==', organizacaoId))
    : materiasCollectionRef
  const querySnapshot = await getDocs(materiasQuery);
  const materiasList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Materia));
  return materiasList;
};

// FUNÇÃO PARA ADICIONAR UMA NOVA MATÉRIA
export const adicionarMateria = async (novaMateria: Omit<Materia, 'id'>) => {
  const docRef = await addDoc(materiasCollectionRef, novaMateria);
  return docRef;
};

// FUNÇÃO PARA ATUALIZAR UMA MATÉRIA
export const atualizarMateria = async (id: string, dadosAtualizados: Partial<Materia>) => {
  const materiaDoc = doc(db, 'materias', id);
  await updateDoc(materiaDoc, dadosAtualizados);
};

// FUNÇÃO PARA DELETAR UMA MATÉRIA
export const deletarMateria = async (id: string) => {
  const materiaDoc = doc(db, 'materias', id);
  await deleteDoc(materiaDoc);
};