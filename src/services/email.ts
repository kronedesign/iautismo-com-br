import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_iautismo';
const EMAILJS_TEMPLATE_ID_WELCOME = 'template_welcome';
const EMAILJS_TEMPLATE_ID_RESET = 'template_reset';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your actual public key

interface EmailParams {
  to_email: string;
  to_name: string;
  [key: string]: string;
}

export async function sendWelcomeEmail(params: EmailParams): Promise<void> {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_WELCOME,
      params,
      EMAILJS_PUBLIC_KEY
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Falha ao enviar email de boas-vindas');
  }
}

export async function sendPasswordResetEmail(params: EmailParams): Promise<void> {
  try {
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${params.to_email}`;

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_RESET,
      {
        ...params,
        reset_link: resetLink,
      },
      EMAILJS_PUBLIC_KEY
    );

    // Store the reset token in IndexedDB
    const db = await initDB();
    const transaction = db.transaction(['users'], 'readwrite');
    const userStore = transaction.objectStore('users');
    const emailIndex = userStore.index('email');
    
    const request = emailIndex.get(params.to_email);
    
    request.onsuccess = () => {
      const user = request.result;
      if (user) {
        user.resetToken = resetToken;
        user.resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour expiration
        userStore.put(user);
      }
    };
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw new Error('Falha ao enviar email de recuperação de senha');
  }
}

export async function validateResetToken(email: string, token: string): Promise<boolean> {
  const db = await initDB();
  const transaction = db.transaction(['users'], 'readonly');
  const userStore = transaction.objectStore('users');
  const emailIndex = userStore.index('email');
  
  return new Promise((resolve) => {
    const request = emailIndex.get(email);
    
    request.onsuccess = () => {
      const user = request.result;
      if (!user || 
          user.resetToken !== token || 
          !user.resetTokenExpires || 
          new Date(user.resetTokenExpires) < new Date()) {
        resolve(false);
        return;
      }
      resolve(true);
    };
    
    request.onerror = () => resolve(false);
  });
}