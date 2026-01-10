import { useStore } from '../context/StoreContext';
import { Card } from '../components/ui';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Eye, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui';

export function History() {
    const { sales, deleteSale } = useStore();
    const [viewingSale, setViewingSale] = useState<any>(null);

    // Sort by date desc
    const sortedSales = [...sales].sort((a, b) => b.date.getTime() - a.date.getTime());

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
            await deleteSale(id);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Histórico</h2>

            <div className="space-y-3">
                {sortedSales.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">Nenhuma venda registrada.</p>
                ) : (
                    sortedSales.map(sale => (
                        <Card key={sale.id} className="p-4 flex justify-between items-center shadow-sm border border-gray-100">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 line-clamp-1">{sale.productName}</h4>
                                <p className="text-xs text-gray-500">
                                    {format(sale.date, "d 'de' MMMM", { locale: ptBR })} • {sale.quantity}x
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-bold text-green-600">+ R$ {sale.totalProfit.toFixed(2)}</p>
                                    <p className="text-[10px] text-gray-400">Venda: R$ {sale.salePrice.toFixed(2)}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setViewingSale(sale)}
                                        className="p-2 text-gray-400 hover:text-zyone-black transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sale.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Simple Detail Modal */}
            {viewingSale && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <Card className="w-full max-w-sm p-6 space-y-4 relative">
                        <button
                            onClick={() => setViewingSale(null)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-zyone-black"
                        >
                            <X size={20} />
                        </button>

                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Detalhes da Venda</p>
                            <h3 className="text-xl font-bold text-zyone-black">{viewingSale.productName}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-100">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Data</p>
                                <p className="text-sm font-medium">{format(viewingSale.date, "dd/MM/yyyy")}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Quantidade</p>
                                <p className="text-sm font-medium">{viewingSale.quantity} un</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Preço de Venda</p>
                                <p className="text-sm font-medium">R$ {viewingSale.salePrice.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Preço de Custo</p>
                                <p className="text-sm font-medium">R$ {viewingSale.costPrice.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-xl flex justify-between items-center">
                            <span className="text-xs font-bold text-green-800 uppercase">Lucro Total</span>
                            <span className="text-xl font-black text-green-600">R$ {viewingSale.totalProfit.toFixed(2)}</span>
                        </div>

                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => setViewingSale(null)}
                        >
                            Fechar
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
}
