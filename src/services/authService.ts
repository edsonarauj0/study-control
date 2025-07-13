import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { auth } from '@/firebase';
import { adicionarOrganizacao } from './organizacoesService';

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const register = async (email: string, password:string): Promise<UserCredential> => {
  try {
    // 1. Cria o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      // 2. Define os dados da organização padrão
      const organizacaoPadrao = {
        nome: 'Minha Organização' // ou 'Espaço de Trabalho', 'Minhas Matérias', etc.
      };

      // 3. Adiciona a organização no Firestore para o novo usuário
      await adicionarOrganizacao(organizacaoPadrao, user.uid);
    }
    
    // 4. Retorna as credenciais para o fluxo normal do app (login automático, etc.)
    return userCredential;

  } catch (error) {
    // Loga o erro e o relança para que a UI possa tratá-lo
    console.error("Erro no registro ou na criação da organização:", error);
    throw error;
  }
};
export const logout = () => signOut(auth);
