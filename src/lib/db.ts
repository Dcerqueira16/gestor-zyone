import Dexie, { type EntityTable } from 'dexie';
import type { Sale, Goal } from '../types';

const db = new Dexie('ZyoneSalesDB') as Dexie & {
    sales: EntityTable<Sale, 'id'>;
    goals: EntityTable<Goal, 'id'>;
};

// Schema definition
db.version(1).stores({
    sales: '++id, productId, date, paymentMethod, createdAt',
    goals: '++id, month'
});

db.version(2).stores({
    sales: '++id, userId, productId, date, paymentMethod, createdAt',
    goals: '++id, userId, month, [userId+month]'
});

export { db };
