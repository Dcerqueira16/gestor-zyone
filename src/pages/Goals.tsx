import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Button, Input, Label, Card } from '../components/ui/index';
import { format } from 'date-fns';


export function Goals() {
    const { updateGoal, getGoalByMonth, stats } = useStore();
    const [target, setTarget] = useState(2000);
    const currentMonth = format(new Date(), 'yyyy-MM');

    useEffect(() => {
        const goal = getGoalByMonth(currentMonth);
        if (goal) {
            setTarget(goal.targetAmount);
        }
    }, [getGoalByMonth, currentMonth]);

    const handleSave = async () => {
        await updateGoal(currentMonth, Number(target));
    };

    const remaining = Math.max(stats.monthTarget - stats.monthProfit, 0);
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const todayDay = new Date().getDate();
    const daysLeft = daysInMonth - todayDay;
    const dailyNeeded = daysLeft > 0 ? remaining / daysLeft : 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Metas</h2>

            <Card className="p-6">
                <Label htmlFor="goal">Sua meta de lucro mensal (R$)</Label>
                <div className="flex gap-4 mt-2">
                    <Input
                        id="goal"
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(Number(e.target.value))}
                    />
                    <Button onClick={handleSave}>Salvar</Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 gap-4">
                <Card className="p-6 bg-blue-50 border-blue-100 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-blue-800 mb-1">Faltam para a meta</p>
                        <p className="text-2xl font-bold text-blue-900">R$ {remaining.toFixed(2)}</p>
                    </div>
                </Card>

                <Card className="p-6">
                    <p className="text-sm text-gray-500 mb-1">Para atingir a meta, você precisa lucrar:</p>
                    <p className="text-2xl font-bold">R$ {dailyNeeded.toFixed(2)} <span className="text-sm font-normal text-gray-400">/ dia</span></p>
                    <p className="text-xs text-gray-400 mt-2">Restam {daysLeft} dias no mês.</p>
                </Card>
            </div>
        </div>
    );
}
