import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ZYONE_PRODUCTS } from '../lib/constants';
import { Button, Input, Select, Label, Card } from '../components/ui/index';
import { type PaymentMethod } from '../types';
import { UserPlus, Phone } from 'lucide-react';


export function AddSale() {
    const navigate = useNavigate();
    const { addSale, customers, addCustomer } = useStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [selectedTemplateId, setSelectedTemplateId] = useState(ZYONE_PRODUCTS[0].id);
    const [customName, setCustomName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [salePrice, setSalePrice] = useState(ZYONE_PRODUCTS[0].defaultSalePrice);
    const [costPrice, setCostPrice] = useState(ZYONE_PRODUCTS[0].defaultCostPrice);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Customer State
    const [customerId, setCustomerId] = useState<number | undefined>(undefined);
    const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerPhone, setNewCustomerPhone] = useState('');

    // Update prices when template changes
    useEffect(() => {
        const product = ZYONE_PRODUCTS.find(p => p.id === selectedTemplateId);
        if (product) {
            setSalePrice(product.defaultSalePrice);
            setCostPrice(product.defaultCostPrice);
        }
    }, [selectedTemplateId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const template = ZYONE_PRODUCTS.find(p => p.id === selectedTemplateId);
            let finalCustomerId = customerId;

            // Handle new customer fast registration
            if (isAddingNewCustomer && newCustomerName) {
                const newId = await addCustomer({
                    name: newCustomerName,
                    whatsapp: newCustomerPhone
                });
                if (newId) {
                    finalCustomerId = newId;
                }
            }

            await addSale({
                productId: template?.id || 'custom',
                productName: customName,
                quantity: Number(quantity),
                costPrice: Number(costPrice),
                salePrice: Number(salePrice),
                paymentMethod,
                date: new Date(date),
                customerId: finalCustomerId
            });

            setQuantity(1);
            navigate('/');

        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const projectedProfit = (salePrice - costPrice) * quantity;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Operacional</p>
                <h2 className="text-3xl font-extrabold tracking-tight text-zyone-black">Nova Venda</h2>
            </div>

            <Card className="p-6 border-0 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Template Selection */}
                    <div>
                        <Label htmlFor="product">Tipo de Produto</Label>
                        <Select
                            id="product"
                            value={selectedTemplateId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTemplateId(e.target.value)}
                            className="font-medium"
                        >
                            {ZYONE_PRODUCTS.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </Select>
                    </div>

                    {/* Customer Selection */}
                    <div className="bg-zyone-gray/50 p-4 rounded-2xl border border-dashed border-gray-200 space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="mb-0 flex items-center gap-1">
                                <UserPlus size={14} className="text-zyone-gold" /> Cliente
                            </Label>
                            <button
                                type="button"
                                onClick={() => setIsAddingNewCustomer(!isAddingNewCustomer)}
                                className="text-[10px] font-bold uppercase text-zyone-gold"
                            >
                                {isAddingNewCustomer ? 'Selecionar Existente' : '+ Novo Cliente'}
                            </button>
                        </div>

                        {isAddingNewCustomer ? (
                            <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                                <Input
                                    placeholder="Nome do cliente"
                                    value={newCustomerName}
                                    onChange={e => setNewCustomerName(e.target.value)}
                                    className="bg-white"
                                />
                                <div className="relative">
                                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="WhatsApp (opcional)"
                                        value={newCustomerPhone}
                                        onChange={e => setNewCustomerPhone(e.target.value)}
                                        className="pl-9 bg-white"
                                    />
                                </div>
                            </div>
                        ) : (
                            <Select
                                value={customerId || ''}
                                onChange={e => setCustomerId(e.target.value ? Number(e.target.value) : undefined)}
                                className="bg-white"
                            >
                                <option value="">Nenhum cliente selecionado</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Select>
                        )}
                    </div>

                    {/* Manual Name Input */}
                    <div>
                        <Label htmlFor="customName">Nome do Produto</Label>
                        <Input
                            id="customName"
                            type="text"
                            value={customName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomName(e.target.value)}
                            placeholder="digite o nome do produto"
                        />
                    </div>

                    {/* Main Grid for numeric values */}
                    <div className="grid grid-cols-3 gap-3">
                        {/* Quantity */}
                        <div>
                            <Label htmlFor="quantity">Qtd</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="h-11"
                            />
                        </div>

                        {/* Cost Price */}
                        <div>
                            <Label htmlFor="costPrice">Custo (un)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span>
                                <Input
                                    id="costPrice"
                                    type="number"
                                    step="0.01"
                                    className="pl-8 h-11 text-sm"
                                    value={costPrice}
                                    onChange={(e) => setCostPrice(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* Sale Price (Unit) */}
                        <div>
                            <Label htmlFor="price">Venda (un)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    className="pl-8 h-11 text-sm"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Payment */}
                        <div>
                            <Label htmlFor="payment">Pagamento</Label>
                            <Select
                                id="payment"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                className="h-11"
                            >
                                <option value="PIX">Pix</option>
                                <option value="CASH">Dinheiro</option>
                                <option value="CARD">Cartão</option>
                            </Select>
                        </div>

                        {/* Date */}
                        <div>
                            <Label htmlFor="date">Data</Label>
                            <Input
                                id="date"
                                type="date"
                                className="h-11"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Profit Preview */}
                    <div className="bg-zyone-gray p-5 rounded-2xl flex justify-between items-center text-zyone-black border border-gray-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Lucro Estimado</span>
                        <span className="text-2xl font-black text-green-600">R$ {projectedProfit.toFixed(2)}</span>
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full h-14 text-lg font-bold shadow-lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Confirmar Venda'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
