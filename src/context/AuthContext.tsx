import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
    user: SupabaseUser | null;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            toast.success('Login realizado com sucesso!');
            return { error: null };
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Erro ao realizar login');
            return { error };
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });
            if (error) throw error;
            toast.success('Cadastro realizado! Verifique seu email.');
            return { error: null };
        } catch (error: any) {
            console.error('Signup error:', error);
            toast.error(error.message || 'Erro ao realizar cadastro');
            return { error };
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            toast.success('Você saiu do sistema');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        signIn,
        signUp,
        signOut,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
