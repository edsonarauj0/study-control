import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizacao } from '@/contexts/OrganizacaoContext';
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
  const { activeOrganizacao } = useOrganizacao();

  // Carregar favoritos do Firestore
  const loadFavorites = async () => {
    // Nenhuma mudança aqui é estritamente necessária se o serviço usar auth.currentUser
    if (!user || !activeOrganizacao) {
      setFavoritesMaterias([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      debugger
      const favorites = await fetchFavoritesMaterias(activeOrganizacao.id);

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


  useEffect(() => {
    loadFavorites();
  }, [user, activeOrganizacao?.id]); // Adicionado .id para garantir que o useEffect detecte mudanças na organização ativa

  const addToFavorites = async (materia: FavoriteMateriaDisplay) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
debugger
    try {
      await addMateriaToFavorites({
        materiaId: materia.id,
        nome: materia.nome,
        emoji: materia.emoji,
        organizacaoId: materia.organizacaoId,
        professor: materia.professor
      });

      setFavoritesMaterias(prev => {
        if (prev.find(fav => fav.id === materia.id)) {
          return prev;
        }
        return [...prev, materia];
      });

      await loadFavorites();
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (materiaId: string) => {
    if (!user || !activeOrganizacao) {
        throw new Error('Usuário não autenticado ou organização ativa não definida');
    }

    try {
        await removeMateriaFromFavorites(activeOrganizacao.id, materiaId);
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
