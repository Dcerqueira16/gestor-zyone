import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ZYONE_PRODUCTS } from '../lib/constants';
import { Button, Input, Select, Label, Card } from '../components/ui/index';
import { type PaymentMethod } from '../types';


export function AddSale() {
    const navigate = useNavigate();
    const { addSale } = useStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [selectedTemplateId, setSelectedTemplateId] = useState(ZYONE_PRODUCTS[0].id);
    const [customName, setCustomName] = useState(ZYONE_PRODUCTS[0].name);
    const [quantity, setQuantity] = useState(1);
    const [salePrice, setSalePrice] = useState(ZYONE_PRODUCTS[0].defaultSalePrice);
    const [costPrice, setCostPrice] = useState(ZYONE_PRODUCTS[0].defaultCostPrice);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Update prices/name when template changes
    useEffect(() => {
        const product = ZYONE_PRODUCTS.find(p => p.id === selectedTemplateId);
        if (product) {
            setSalePrice(product.defaultSalePrice);
            setCostPrice(product.defaultCostPrice);
            // We set a default name, but user can change it
            setCustomName(product.name);
        }
    }, [selectedTemplateId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const template = ZYONE_PRODUCTS.find(p => p.id === selectedTemplateId);

            await addSale({
                productId: template?.id || 'custom', // Keep tracking origin template if possible
                productName: customName, // Use the custom name
                quantity: Number(quantity),
                costPrice: Number(costPrice),
                salePrice: Number(salePrice),
                paymentMethod,
                date: new Date(date)
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

                    {/* Manual Name Input */}
                    <div>
                        <Label htmlFor="customName">Nome (Opcional)</Label>
                        <Input
                            id="customName"
                            type="text"
                            value={customName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomName(e.target.value)}
                            placeholder="Ex: Gold, Silver, Rose..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Quantity */}
                        <div>
                            <Label htmlFor="quantity">Qtd</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))}
                            />
                        </div>

                        {/* Sale Price (Unit) */}
                        <div>
                            <Label htmlFor="price">Valor Venda (un)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    className="pl-9"
                                    value={salePrice}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalePrice(Number(e.target.value))}
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
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value as PaymentMethod)}
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
                                value={date}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Profit Preview */}
                    <div className="bg-zyone-gray p-5 rounded-2xl flex justify-between items-center text-zyone-black border border-gray-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Lucro Estimado</span>
                        <span className="text-2xl font-black text-green-600">R$ {projectedProfit.toFixed(2)}</span>
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Confirmar Venda'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
