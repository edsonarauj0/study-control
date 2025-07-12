import { db } from '@/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

export interface FavoriteMateria {
  id?: string; // ID do documento no Firestore
  materiaId: string; // ID da matéria
  userId: string; // ID do usuário
  nome: string;
  emoji: string;
  organizacaoId: string;
  professor: string;
  createdAt: Date;
}

// Buscar favoritos de um usuário
export const fetchFavoritesMaterias = async (userId: string): Promise<FavoriteMateria[]> => {
  const favoritesRef = collection(db, 'favoritos');
  const q = query(favoritesRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date()
  })) as FavoriteMateria[];
};

// Adicionar matéria aos favoritos
export const addMateriaToFavorites = async (favorite: Omit<FavoriteMateria, 'id' | 'createdAt'>) => {
  const favoritesRef = collection(db, 'favoritos');
  
  // Verificar se já não está nos favoritos
  const q = query(
    favoritesRef, 
    where('userId', '==', favorite.userId),
    where('materiaId', '==', favorite.materiaId)
  );
  const existingSnapshot = await getDocs(q);
  
  if (!existingSnapshot.empty) {
    throw new Error('Matéria já está nos favoritos');
  }
  
  const docRef = await addDoc(favoritesRef, {
    ...favorite,
    createdAt: new Date()
  });
  
  return docRef;
};

// Remover matéria dos favoritos
export const removeMateriaFromFavorites = async (userId: string, materiaId: string) => {
  const favoritesRef = collection(db, 'favoritos');
  const q = query(
    favoritesRef, 
    where('userId', '==', userId),
    where('materiaId', '==', materiaId)
  );
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    throw new Error('Favorito não encontrado');
  }
  
  // Deletar o primeiro documento encontrado (deve ser único)
  const favoriteDoc = snapshot.docs[0];
  await deleteDoc(doc(db, 'favoritos', favoriteDoc.id));
};

// Verificar se uma matéria está nos favoritos
export const isMateriaFavorite = async (userId: string, materiaId: string): Promise<boolean> => {
  const favoritesRef = collection(db, 'favoritos');
  const q = query(
    favoritesRef, 
    where('userId', '==', userId),
    where('materiaId', '==', materiaId)
  );
  const snapshot = await getDocs(q);
  
  return !snapshot.empty;
};
