import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function Register() {
    const navigate = useNavigate();
    const { signUp, isLoading: authLoading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('As senhas não conferem');
            return;
        }

        if (password.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        setIsSubmitting(true);
        const { error } = await signUp(email, password, name);
        setIsSubmitting(false);

        if (!error) {
            // Success
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
                    <p className="text-gray-500">Comece a gerenciar suas vendas Zyone</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <Input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu nome"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                        <Input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="******"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
                        {isSubmitting ? 'Criando conta...' : 'Cadastrar'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Já tem uma conta? </span>
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                        Entrar
                    </Link>
                </div>
            </Card>
        </div>
    );
}
