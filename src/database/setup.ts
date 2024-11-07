import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Existing schemas
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  userType: z.enum(['parent', 'professional', 'admin', 'agent']),
  agentLevel: z.number().min(1).max(5).optional(),
  createdAt: z.date().optional(),
  asaasCustomerId: z.string().optional(),
});

export const ProfessionalSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  profession: z.string(),
  specialization: z.string(),
  licenseNumber: z.string(),
  isApproved: z.boolean().default(false),
  createdAt: z.date().optional(),
});

export const SubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  asaasSubscriptionId: z.string(),
  status: z.enum(['active', 'inactive', 'overdue', 'canceled']),
  plan: z.enum(['basic', 'premium', 'professional']),
  createdAt: z.date(),
  nextBillingDate: z.date(),
});

// New schema for AI Agents
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  iframeCode: z.string(),
  level: z.number().min(1).max(5),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type Professional = z.infer<typeof ProfessionalSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type Agent = z.infer<typeof AgentSchema>;

const DB_NAME = 'iautismo_db';
const DB_VERSION = 4; // Incrementing version to add agents store

export function clearCache() {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    
    request.onerror = () => {
      reject(new Error('Error clearing cache'));
    };
    
    request.onsuccess = () => {
      resolve();
    };
  });
}

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      
      // Create admin user if it doesn't exist
      const transaction = db.transaction(['users'], 'readwrite');
      const userStore = transaction.objectStore('users');
      const emailIndex = userStore.index('email');
      
      const adminEmail = 'iautismo.com.br@gmail.com';
      const getRequest = emailIndex.get(adminEmail);
      
      getRequest.onsuccess = () => {
        if (!getRequest.result) {
          // Create admin user
          const adminUser: User = {
            id: uuidv4(),
            email: adminEmail,
            password: 'FORTUNA@369',
            name: 'Admin IAutismo',
            userType: 'admin',
            createdAt: new Date(),
          };
          
          userStore.add(adminUser);
        }
      };
      
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Drop and recreate stores to clear cache
      if (db.objectStoreNames.contains('users')) {
        db.deleteObjectStore('users');
      }
      if (db.objectStoreNames.contains('professionals')) {
        db.deleteObjectStore('professionals');
      }
      if (db.objectStoreNames.contains('subscriptions')) {
        db.deleteObjectStore('subscriptions');
      }
      if (db.objectStoreNames.contains('agents')) {
        db.deleteObjectStore('agents');
      }

      // Recreate stores with updated schemas
      const userStore = db.createObjectStore('users', { keyPath: 'id' });
      userStore.createIndex('email', 'email', { unique: true });
      userStore.createIndex('userType', 'userType', { unique: false });
      userStore.createIndex('agentLevel', 'agentLevel', { unique: false });

      const professionalStore = db.createObjectStore('professionals', { keyPath: 'id' });
      professionalStore.createIndex('userId', 'userId', { unique: true });
      professionalStore.createIndex('isApproved', 'isApproved', { unique: false });

      const subscriptionStore = db.createObjectStore('subscriptions', { keyPath: 'id' });
      subscriptionStore.createIndex('userId', 'userId', { unique: false });
      subscriptionStore.createIndex('status', 'status', { unique: false });
      subscriptionStore.createIndex('asaasSubscriptionId', 'asaasSubscriptionId', { unique: true });

      // Create new store for AI Agents
      const agentStore = db.createObjectStore('agents', { keyPath: 'id' });
      agentStore.createIndex('level', 'level', { unique: false });
      agentStore.createIndex('createdAt', 'createdAt', { unique: false });
    };
  });
}