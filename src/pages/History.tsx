import { useStore } from '../context/StoreContext';
import { Card } from '../components/ui';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function History() {
    const { sales } = useStore();

    // Sort by date desc
    const sortedSales = [...sales].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Histórico</h2>

            <div className="space-y-3">
                {sortedSales.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">Nenhuma venda registrada.</p>
                ) : (
                    sortedSales.map(sale => (
                        <Card key={sale.id} className="p-4 flex justify-between items-center shadow-sm border border-gray-100">
                            <div>
                                <h4 className="font-semibold text-gray-900">{sale.productName}</h4>
                                <p className="text-xs text-gray-500">
                                    {format(sale.date, "d 'de' MMMM", { locale: ptBR })} • {sale.quantity}x
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600">+ R$ {sale.totalProfit.toFixed(2)}</p>
                                <p className="text-xs text-gray-400">Venda: R$ {sale.salePrice}</p>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
