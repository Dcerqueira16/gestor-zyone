import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

// Bypass strict typing for MVP speed - preventing "type never" errors
const db = supabase as any;
import { type Sale, type Goal, type Customer } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface StoreContextType {
    sales: Sale[];
    goals: Goal[];
    customers: Customer[];
    addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'totalProfit' | 'userId'>) => Promise<void>;
    updateSale: (id: number, sale: Partial<Omit<Sale, 'id' | 'createdAt' | 'totalProfit' | 'userId'>>) => Promise<void>;
    deleteSale: (id: number) => Promise<void>;
    addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'userId'>) => Promise<number | undefined>;
    updateCustomer: (id: number, customer: Partial<Omit<Customer, 'id' | 'createdAt' | 'userId'>>) => Promise<void>;
    deleteCustomer: (id: number) => Promise<void>;
    updateGoal: (month: string, target: number) => Promise<void>;
    getGoalByMonth: (month: string) => Goal | undefined;
    stats: {
        todayProfit: number;
        todaySalesCount: number;
        monthProfit: number;
        monthSalesCount: number;
        monthGoalProgress: number;
        monthTarget: number;
    };
    loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Define Supabase Row Types
type GoalsRow = {
    id: number;
    user_id: string;
    month: string;
    target_profit: number;
    created_at: string;
};

type CustomersRow = {
    id: number;
    user_id: string;
    name: string;
    whatsapp: string;
    created_at: string;
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [sales, setSales] = useState<Sale[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!user) {
            setSales([]);
            setGoals([]);
            return;
        }

        setLoading(true);
        try {
            // Fetch Sales
            const { data: salesData, error: salesError } = await db
                .from('sales')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (salesError) throw salesError;

            // Fetch Goals
            const { data: goalsData, error: goalsError } = await db
                .from('goals')
                .select('*')
                .eq('user_id', user.id);

            if (goalsError) throw goalsError;

            // Fetch Customers
            const { data: customersData, error: customersError } = await db
                .from('customers')
                .select('*')
                .eq('user_id', user.id)
                .order('name', { ascending: true });

            if (customersError) {
                console.error('Customers table might not exist yet:', customersError);
                // We don't throw to allow app to work even if CRM table isn't ready
                setCustomers([]);
            } else {
                const mappedCustomers: Customer[] = (customersData as any[]).map((c: CustomersRow) => ({
                    id: c.id,
                    userId: c.user_id,
                    name: c.name,
                    whatsapp: c.whatsapp,
                    createdAt: new Date(c.created_at)
                }));
                setCustomers(mappedCustomers);
            }

            // Map Data
            const mappedSales: Sale[] = (salesData as any[]).map((s: any) => ({
                id: s.id,
                userId: s.user_id,
                productId: 'manual',
                productName: s.product_name,
                quantity: 1, // Defaulting to 1 as DB stores totals
                costPrice: s.cost_price,
                salePrice: s.sale_price,
                totalProfit: s.sale_price - s.cost_price,
                date: new Date(s.date),
                paymentMethod: 'CASH',
                customerId: s.customer_id,
                createdAt: new Date(s.created_at)
            }));

            setSales(mappedSales);

            const mappedGoals: Goal[] = (goalsData as any[]).map((g: GoalsRow) => ({
                id: g.id,
                userId: g.user_id,
                month: g.month,
                targetAmount: g.target_profit,
                updatedAt: new Date(g.created_at)
            }));

            setGoals(mappedGoals);

        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Erro ao carregar dados.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const addSale = async (saleData: Omit<Sale, 'id' | 'createdAt' | 'totalProfit' | 'userId'>) => {
        if (!user) return;

        try {
            // Store total values
            const totalCost = saleData.costPrice * saleData.quantity;
            const totalSale = saleData.salePrice * saleData.quantity;

            const { error } = await db.from('sales').insert({
                user_id: user.id,
                product_name: `${saleData.quantity}x ${saleData.productName}`,
                cost_price: totalCost,
                sale_price: totalSale,
                date: saleData.date.toISOString(),
                customer_id: saleData.customerId
            });

            if (error) throw error;

            toast.success('Venda salva no Supabase!');
            fetchData();

        } catch (error) {
            console.error('Failed to add sale:', error);
            toast.error('Erro ao salvar venda.');
        }
    };

    const updateSale = async (id: number, saleData: Partial<Omit<Sale, 'id' | 'createdAt' | 'totalProfit' | 'userId'>>) => {
        if (!user) return;

        try {
            // If recalculating totals is needed based on partial data
            // We usually receive the full data from the edit form
            const updates: any = {};
            if (saleData.productName) updates.product_name = saleData.productName;

            // Support updating totals if quantity/prices change
            if (saleData.salePrice !== undefined && saleData.quantity !== undefined) {
                updates.sale_price = saleData.salePrice * saleData.quantity;
            }
            if (saleData.costPrice !== undefined && saleData.quantity !== undefined) {
                updates.cost_price = saleData.costPrice * saleData.quantity;
            }
            if (saleData.date) updates.date = saleData.date.toISOString();

            // Special case for our concatenated product_name in DB
            if (saleData.quantity !== undefined && saleData.productName) {
                updates.product_name = `${saleData.quantity}x ${saleData.productName}`;
            }
            if (saleData.customerId !== undefined) {
                updates.customer_id = saleData.customerId;
            }

            const { error } = await db.from('sales').update(updates).eq('id', id);

            if (error) throw error;

            toast.success('Venda atualizada!');
            fetchData();
        } catch (error) {
            console.error('Failed to update sale:', error);
            toast.error('Erro ao atualizar venda.');
        }
    };

    const deleteSale = async (id: number) => {
        if (!user) return;

        try {
            const { error } = await db.from('sales').delete().eq('id', id);

            if (error) throw error;

            toast.success('Venda excluída!');
            fetchData();
        } catch (error) {
            console.error('Failed to delete sale:', error);
            toast.error('Erro ao excluir venda.');
        }
    };

    const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'userId'>): Promise<number | undefined> => {
        if (!user) return;
        try {
            const { data, error } = await db.from('customers').insert({
                user_id: user.id,
                name: customerData.name,
                whatsapp: customerData.whatsapp
            }).select();

            if (error) throw error;
            toast.success('Cliente cadastrado!');
            fetchData();
            return data?.[0]?.id;
        } catch (error) {
            console.error('Failed to add customer:', error);
            toast.error('Erro ao salvar cliente.');
            return undefined;
        }
    };

    const updateCustomer = async (id: number, customerData: Partial<Omit<Customer, 'id' | 'createdAt' | 'userId'>>) => {
        if (!user) return;
        try {
            const updates: any = {};
            if (customerData.name) updates.name = customerData.name;
            if (customerData.whatsapp !== undefined) updates.whatsapp = customerData.whatsapp;

            const { error } = await db.from('customers').update(updates).eq('id', id);
            if (error) throw error;
            toast.success('Cliente atualizado!');
            fetchData();
        } catch (error) {
            console.error('Failed to update customer:', error);
            toast.error('Erro ao atualizar cliente.');
        }
    };

    const deleteCustomer = async (id: number) => {
        if (!user) return;
        try {
            const { error } = await db.from('customers').delete().eq('id', id);
            if (error) throw error;
            toast.success('Cliente excluído!');
            fetchData();
        } catch (error) {
            console.error('Failed to delete customer:', error);
            toast.error('Erro ao excluir cliente.');
        }
    };

    const updateGoal = async (month: string, target: number) => {
        if (!user) return;

        try {
            const existing = goals.find(g => g.month === month);

            if (existing) {
                const { error } = await db
                    .from('goals')
                    .update({ target_profit: target })
                    .eq('id', existing.id);
                if (error) throw error;
            } else {
                const { error } = await db
                    .from('goals')
                    .insert({
                        user_id: user.id,
                        month: month,
                        target_profit: target
                    });
                if (error) throw error;
            }

            toast.success('Meta atualizada!');
            fetchData();
        } catch (error) {
            console.error('Failed to save goal:', error);
            toast.error('Erro ao salvar meta.');
        }
    };

    const getGoalByMonth = (month: string) => {
        return goals.find(g => g.month === month);
    };

    // Stats Calculation
    const todayDate = new Date();
    const currentMonthStr = format(todayDate, 'yyyy-MM');

    const todayString = todayDate.toDateString();

    const todaySales = sales.filter(s => s.date.toDateString() === todayString);
    const monthSales = sales.filter(s => format(s.date, 'yyyy-MM') === currentMonthStr);

    const todayProfit = todaySales.reduce((acc, s) => acc + s.totalProfit, 0);
    const monthProfit = monthSales.reduce((acc, s) => acc + s.totalProfit, 0);
    const monthSalesCount = monthSales.length;
    const currentGoal = goals.find(g => g.month === currentMonthStr);
    const monthTarget = currentGoal?.targetAmount || 0;
    const monthGoalProgress = monthTarget > 0 ? (monthProfit / monthTarget) * 100 : 0;

    const value = {
        sales,
        goals,
        customers,
        addSale,
        updateSale,
        deleteSale,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        updateGoal,
        getGoalByMonth,
        stats: {
            todayProfit,
            todaySalesCount: todaySales.length,
            monthProfit,
            monthSalesCount,
            monthGoalProgress,
            monthTarget
        },
        loading
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
