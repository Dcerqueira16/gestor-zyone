import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Label, Card } from '../components/ui/index';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { error } = await signIn(email, password);
        setIsSubmitting(false);
        if (!error) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm p-8 shadow-xl border-0">
                <div className="text-center mb-8">
                    <div className="h-20 w-20 flex items-center justify-center mx-auto mb-4">
                        <img src="/src/assets/zyone-logo.png" alt="Zyone" className="h-full w-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestor Zyone</h1>
                    <p className="text-sm text-gray-500 mt-2">Entre para gerenciar suas vendas</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Não tem uma conta? </span>
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                            Cadastre-se
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}
