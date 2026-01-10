import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Input } from '../components/ui';
import { User, Phone, MessageCircle, Trash2, Search } from 'lucide-react';
import { type Customer, type Sale } from '../types';

export default function Customers() {
    const { customers, sales, deleteCustomer } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter((c: Customer) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCustomerStats = (customerId: number) => {
        const customerSales = sales.filter((s: Sale) => s.customerId === customerId);
        const totalProfit = customerSales.reduce((acc: number, s: Sale) => acc + s.totalProfit, 0);
        return {
            salesCount: customerSales.length,
            totalProfit
        };
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente? As vendas associadas não serão excluídas, mas perderão o vínculo.')) {
            await deleteCustomer(id);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">CRM</p>
                <h2 className="text-3xl font-extrabold tracking-tight text-zyone-black">Meus Clientes</h2>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Buscar cliente..."
                    className="pl-11 h-12 shadow-sm border-0"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-3">
                {filteredCustomers.length === 0 ? (
                    <Card className="p-10 text-center border-dashed">
                        <User size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-500">Nenhum cliente encontrado.</p>
                    </Card>
                ) : (
                    filteredCustomers.map((customer: Customer) => {
                        const stats = getCustomerStats(customer.id);
                        return (
                            <Card key={customer.id} className="p-5 border-0 shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zyone-gray flex items-center justify-center text-zyone-gold font-bold">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zyone-black">{customer.name}</h3>
                                            {customer.whatsapp && (
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Phone size={10} /> {customer.whatsapp}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(customer.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-4">
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Compras</span>
                                        <p className="text-xl font-black text-zyone-black">{stats.salesCount}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Lucro Total</span>
                                        <p className="text-xl font-black text-green-600">R$ {stats.totalProfit.toFixed(2)}</p>
                                    </div>
                                </div>

                                {customer.whatsapp && (
                                    <a
                                        href={`https://wa.me/55${customer.whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
                                    >
                                        <MessageCircle size={18} /> WhatsApp
                                    </a>
                                )}
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
