// services/favoritos.ts

import { auth, db } from '@/firebase';
// A CORREÇÃO ESTÁ AQUI 👇
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface FavoriteMateria {
  id?: string;
  materiaId: string;
  nome: string;
  emoji: string;
  organizacaoId: string;
  professor: string;
  createdAt: Date;
  // userId não é mais necessário no documento
}

export const isMateriaFavorite = async (organizacaoId: string, materiaId: string): Promise<boolean> => {
  const favoritesRef = getFavoritesCollectionRef(organizacaoId);
  const docSnap = await getDoc(doc(favoritesRef, materiaId));
  return docSnap.exists();
};




const getFavoritesCollectionRef = (organizacaoId: string) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Usuário não autenticado');
  return collection(db, 'users', userId, 'organizacoes', organizacaoId, 'favoritos');
};

export const fetchFavoritesMaterias = async (organizacaoId: string): Promise<FavoriteMateria[]> => {
  debugger
  const favoritesRef = getFavoritesCollectionRef(organizacaoId);
  const snapshot = await getDocs(favoritesRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date()
  })) as FavoriteMateria[];
};

export const addMateriaToFavorites = async (favorite: Omit<FavoriteMateria, 'id' | 'createdAt'>) => {
  const favoritesRef = getFavoritesCollectionRef(favorite.organizacaoId);
  const favoriteDoc = await getDoc(doc(favoritesRef, favorite.materiaId));
  if (favoriteDoc.exists()) {
    console.warn(`Matéria com ID ${favorite.materiaId} já está nos favoritos.`);
    return;
  }

  await setDoc(doc(favoritesRef, favorite.materiaId), {
    ...favorite,
    createdAt: new Date()
  });
};

export const removeMateriaFromFavorites = async (organizacaoId: string, materiaId: string) => {
  const favoritesRef = getFavoritesCollectionRef(organizacaoId);
  await deleteDoc(doc(favoritesRef, materiaId));
};
