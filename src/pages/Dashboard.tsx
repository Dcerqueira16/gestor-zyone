import React from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Button } from '../components/ui/index';
import { Link } from 'react-router-dom';
import { TrendingUp, Package } from 'lucide-react';

export function Dashboard() {
    const { stats } = useStore();
    const { todayProfit, monthProfit, monthSalesCount, monthGoalProgress, monthTarget } = stats;

    return (
        <div className="space-y-6">
            {/* Welcome / Date */}
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
                </div>
            </div>

            {/* Goal Progress - Large Card */}
            <Card className="p-6 bg-zyone-black text-white shadow-xl relative overflow-hidden border-2 border-zyone-gold/20">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-300 font-medium tracking-wide">Meta do Mês</span>
                        <span className="text-sm bg-zyone-gold/20 px-2 py-1 rounded text-zyone-gold font-bold">{monthGoalProgress.toFixed(0)}%</span>
                    </div>

                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zyone-gold to-yellow-200">
                            R$ {monthProfit.toFixed(2)}
                        </span>
                        <span className="text-gray-500">/ {monthTarget.toFixed(2)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                        <div
                            className="h-full bg-gradient-to-r from-zyone-gold to-yellow-400 transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(monthGoalProgress, 100)}%` }}
                        />
                    </div>

                    <div className="mt-2 text-xs text-gray-400 text-right">
                        Faltam R$ {(Math.max(monthTarget - monthProfit, 0)).toFixed(2)}
                    </div>
                </div>

                {/* Abstract Pattern background */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-zyone-gold rounded-full blur-[80px] opacity-10"></div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <StatsCard
                    title="Lucro Hoje"
                    value={`R$ ${todayProfit.toFixed(2)}`}
                    icon={<TrendingUp size={20} className="text-green-600" />}
                />
                <StatsCard
                    title="Vendas Mês"
                    value={monthSalesCount}
                    icon={<Package size={20} className="text-blue-600" />}

                />
            </div>

            {/* Action Helper */}
            {monthSalesCount === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Nenhuma venda este mês.</p>
                    <Link to="/add-sale">
                        <Button>Começar Agora</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

function StatsCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
    return (
        <Card className="p-4 flex flex-col justify-between h-32 border-0 shadow-sm bg-white">
            <div className="flex justify-between items-start">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
            </div>
            <div>
                <span className="text-xs text-gray-500 font-medium">{title}</span>
                <h3 className="text-xl font-bold">{value}</h3>
            </div>
        </Card>
    );
}
