import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  fetchFavoritesMaterias, 
  addMateriaToFavorites, 
  removeMateriaFromFavorites,
  FavoriteMateria 
} from '@/services/favoritosService';

export interface FavoriteMateriaDisplay {
  id: string; // materiaId
  nome: string;
  emoji: string;
  organizacaoId: string;
  professor: string;
}

interface FavoritesContextType {
  favoritesMaterias: FavoriteMateriaDisplay[];
  addToFavorites: (materia: FavoriteMateriaDisplay) => Promise<void>;
  removeFromFavorites: (materiaId: string) => Promise<void>;
  isFavorite: (materiaId: string) => boolean;
  loading: boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoritesMaterias, setFavoritesMaterias] = useState<FavoriteMateriaDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Carregar favoritos do Firestore
  const loadFavorites = async () => {
    if (!user) {
      setFavoritesMaterias([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const favorites = await fetchFavoritesMaterias(user.uid);
      const favoritesDisplay = favorites.map(fav => ({
        id: fav.materiaId,
        nome: fav.nome,
        emoji: fav.emoji,
        organizacaoId: fav.organizacaoId,
        professor: fav.professor
      }));
      setFavoritesMaterias(favoritesDisplay);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar favoritos quando o usuário mudar
  useEffect(() => {
    loadFavorites();
  }, [user]);

  const addToFavorites = async (materia: FavoriteMateriaDisplay) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await addMateriaToFavorites({
        materiaId: materia.id,
        userId: user.uid,
        nome: materia.nome,
        emoji: materia.emoji,
        organizacaoId: materia.organizacaoId,
        professor: materia.professor
      });
      
      // Atualizar estado local
      setFavoritesMaterias(prev => {
        if (prev.find(fav => fav.id === materia.id)) {
          return prev;
        }
        return [...prev, materia];
      });
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (materiaId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await removeMateriaFromFavorites(user.uid, materiaId);
      
      // Atualizar estado local
      setFavoritesMaterias(prev => prev.filter(fav => fav.id !== materiaId));
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      throw error;
    }
  };

  const isFavorite = (materiaId: string) => {
    return favoritesMaterias.some(fav => fav.id === materiaId);
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  return (
    <FavoritesContext.Provider value={{
      favoritesMaterias,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      loading,
      refreshFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}
