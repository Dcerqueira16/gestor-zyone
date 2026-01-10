import { useStore } from '../context/StoreContext';
import { Card } from '../components/ui';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Eye, X, Edit2, Check, User } from 'lucide-react';
import { useState } from 'react';
import { Button, Input, Label } from '../components/ui';

export function History() {
    const { sales, deleteSale, updateSale, customers } = useStore();
    const [viewingSale, setViewingSale] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Edit Form State
    const [editName, setEditName] = useState('');
    const [editQty, setEditQty] = useState(1);
    const [editSalePrice, setEditSalePrice] = useState(0);
    const [editCostPrice, setEditCostPrice] = useState(0);
    const [editDate, setEditDate] = useState('');

    // Sort by date desc
    const sortedSales = [...sales].sort((a, b) => b.date.getTime() - a.date.getTime());

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
            await deleteSale(id);
        }
    };

    const handleOpenDetails = (sale: any) => {
        setViewingSale(sale);
        setIsEditing(false);
        // Sync edit state
        setEditName(sale.productName.replace(/^\d+x /, ''));
        setEditQty(sale.quantity);
        setEditSalePrice(sale.salePrice);
        setEditCostPrice(sale.costPrice);
        setEditDate(format(sale.date, 'yyyy-MM-dd'));
    };

    const handleUpdate = async () => {
        if (!viewingSale) return;
        await updateSale(viewingSale.id, {
            productName: editName,
            quantity: editQty,
            salePrice: editSalePrice,
            costPrice: editCostPrice,
            date: new Date(editDate + 'T12:00:00')
        });
        setIsEditing(false);
        setViewingSale(null);
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
                                <p className="text-[10px] text-gray-500 flex items-center gap-2">
                                    <span>{format(sale.date, "d 'de' MMMM", { locale: ptBR })} • {sale.quantity}x</span>
                                    {sale.customerId && (
                                        <span className="flex items-center gap-1 text-zyone-gold font-bold">
                                            <User size={10} /> {customers.find(c => c.id === sale.customerId)?.name || '...'}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-bold text-green-600">+ R$ {sale.totalProfit.toFixed(2)}</p>
                                    <p className="text-[10px] text-gray-400">Venda: R$ {sale.salePrice.toFixed(2)}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleOpenDetails(sale)}
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

                        <div className="flex justify-between items-start pr-8">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">
                                    {isEditing ? 'Editar Venda' : 'Detalhes da Venda'}
                                </p>
                                {!isEditing && (
                                    <>
                                        <h3 className="text-xl font-bold text-zyone-black line-clamp-2">{viewingSale.productName}</h3>
                                        {viewingSale.customerId && (
                                            <p className="text-xs text-zyone-gold font-bold flex items-center gap-1 mt-1">
                                                <User size={12} /> {customers.find(c => c.id === viewingSale.customerId)?.name || 'Cliente'}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-zyone-gray text-zyone-black' : 'text-gray-400 hover:text-zyone-black'}`}
                            >
                                <Edit2 size={18} />
                            </button>
                        </div>

                        {isEditing ? (
                            <div className="space-y-3 py-2">
                                <div>
                                    <Label htmlFor="editName">Nome do Produto</Label>
                                    <Input id="editName" value={editName} onChange={e => setEditName(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="editDate">Data</Label>
                                        <Input id="editDate" type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <Label htmlFor="editQty">Qtd</Label>
                                        <Input id="editQty" type="number" value={editQty} onChange={e => setEditQty(Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="editCostPrice">Custo (un)</Label>
                                        <Input id="editCostPrice" type="number" step="0.01" value={editCostPrice} onChange={e => setEditCostPrice(Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <Label htmlFor="editSalePrice">Venda (un)</Label>
                                        <Input id="editSalePrice" type="number" step="0.01" value={editSalePrice} onChange={e => setEditSalePrice(Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className="pt-2 flex gap-2">
                                    <Button variant="secondary" className="flex-1" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                    <Button className="flex-1 gap-2" onClick={handleUpdate}>
                                        <Check size={18} /> Salvar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}
