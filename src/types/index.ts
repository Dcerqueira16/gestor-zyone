export type PaymentMethod = 'PIX' | 'CASH' | 'CARD';

export interface ProductDefinition {
    id: string;
    name: string;
    size?: string;
    defaultCostPrice: number;
    defaultSalePrice: number;
    category: 'PERFUME' | 'COSMETIC';
}

export interface Sale {
    id?: number;
    userId: string; // Link to Supabase User
    productId: string;
    productName: string;
    quantity: number;
    costPrice: number;
    salePrice: number;
    totalProfit: number;
    date: Date;
    paymentMethod: PaymentMethod;
    createdAt: Date;
}

export interface Goal {
    id?: number;
    userId: string; // Link to Supabase User
    month: string; // Format: "YYYY-MM"
    targetAmount: number;
    updatedAt: Date;
}
