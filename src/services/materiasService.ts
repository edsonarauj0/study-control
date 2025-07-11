import { db } from '../firebase'; // Importa a instância do Firestore
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Definindo o tipo para os dados da Matéria
export interface Materia {
  id: string;
  nome: string;
  professor: string;
}

// Referência para a coleção "materias"
const materiasCollectionRef = collection(db, 'materias');

// FUNÇÃO PARA BUSCAR TODAS AS MATÉRIAS
export const fetchMaterias = async (): Promise<Materia[]> => {
  const querySnapshot = await getDocs(materiasCollectionRef);
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