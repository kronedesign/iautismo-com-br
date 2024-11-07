import { v4 as uuidv4 } from 'uuid';
import { User, Professional, initDB } from './setup';

export async function createUser(userData: Omit<User, 'id'>, professionalData?: Omit<Professional, 'id' | 'userId'>): Promise<string> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users', 'professionals'], 'readwrite');
    const userStore = transaction.objectStore('users');
    const emailIndex = userStore.index('email');
    
    // First check if email already exists
    const emailCheck = emailIndex.get(userData.email);
    
    emailCheck.onsuccess = () => {
      if (emailCheck.result) {
        reject(new Error('Este email já está cadastrado'));
        return;
      }

      // If email doesn't exist, proceed with user creation
      const userId = uuidv4();
      const user: User = {
        ...userData,
        id: userId,
        createdAt: new Date(),
      };

      const userRequest = userStore.add(user);

      userRequest.onsuccess = () => {
        if (professionalData && userData.userType === 'professional') {
          const professionalStore = transaction.objectStore('professionals');
          const professional: Professional = {
            ...professionalData,
            id: uuidv4(),
            userId,
            createdAt: new Date(),
          };

          const professionalRequest = professionalStore.add(professional);

          professionalRequest.onsuccess = () => {
            resolve(userId);
          };

          professionalRequest.onerror = () => {
            reject(new Error('Erro ao criar perfil profissional'));
          };
        } else {
          resolve(userId);
        }
      };

      userRequest.onerror = () => {
        reject(new Error('Erro ao criar usuário'));
      };
    };

    emailCheck.onerror = () => {
      reject(new Error('Erro ao verificar email'));
    };

    transaction.onerror = () => {
      reject(transaction.error || new Error('Erro na transação'));
    };
  });
}