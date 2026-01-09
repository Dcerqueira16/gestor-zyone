import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui';
import { Target } from 'lucide-react';
import { cn } from '../lib/utils'; // fix import if needed

export const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: string;
    className?: string;
}> = ({ title, value, icon: Icon, trend, className }) => (
    <Card className={cn("p-4 flex flex-col gap-3", className)}>
        <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">{title}</span>
            <div className="p-2 bg-slate-50 rounded-lg">
                <Icon className="w-5 h-5 text-brand-600" />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
            {trend && <span className="text-xs text-emerald-600 font-medium flex items-center bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
        </div>
    </Card>
);

export const GoalProgress: React.FC<{
    current: number;
    target: number;
}> = ({ current, target }) => {
    const percentage = Math.min(100, Math.max(0, (current / (target || 1)) * 100));

    return (
        <Card className="p-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-none shadow-brand-500/30 shadow-xl overflow-hidden relative">
            {/* Background decorative blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />

            <div className="flex items-center justify-between relative z-10 mb-4">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-100" />
                    <span className="text-brand-100 font-medium text-sm">Meta Mensal</span>
                </div>
                <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
            </div>

            <div className="relative h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-white rounded-full"
                />
            </div>

            <div className="flex justify-between mt-4 text-sm relative z-10">
                <div className="flex flex-col">
                    <span className="text-brand-200 text-xs">Atual</span>
                    <span className="font-semibold">R$ {current.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-brand-200 text-xs">Alvo</span>
                    <span className="font-semibold">R$ {target.toFixed(2)}</span>
                </div>
            </div>
        </Card>
    )
}
