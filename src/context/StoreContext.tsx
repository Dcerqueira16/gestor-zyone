import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

// Bypass strict typing for MVP speed - preventing "type never" errors
const db = supabase as any;
import { type Sale, type Goal } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface StoreContextType {
    sales: Sale[];
    goals: Goal[];
    addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'totalProfit' | 'userId'>) => Promise<void>;
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
type SalesRow = {
    id: number;
    user_id: string;
    product_name: string;
    cost_price: number;
    sale_price: number;
    date: string;
    created_at: string;
};

type GoalsRow = {
    id: number;
    user_id: string;
    month: string;
    target_profit: number;
    created_at: string;
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [sales, setSales] = useState<Sale[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
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

            // Map Data
            const mappedSales: Sale[] = (salesData as any[]).map((s: SalesRow) => ({
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
                date: saleData.date.toISOString()
            });

            if (error) throw error;

            toast.success('Venda salva no Supabase!');
            fetchData();

        } catch (error) {
            console.error('Failed to add sale:', error);
            toast.error('Erro ao salvar venda.');
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
        addSale,
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
