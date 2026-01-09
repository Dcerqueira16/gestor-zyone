import { type ProductDefinition } from '../types';

export const ZYONE_PRODUCTS: ProductDefinition[] = [
    {
        id: 'perfume-10ml',
        name: 'Perfume 10ml',
        size: '10ml',
        defaultCostPrice: 15.00,
        defaultSalePrice: 30.00,
        category: 'PERFUME'
    },
    {
        id: 'perfume-28ml',
        name: 'Perfume 28ml',
        size: '28ml',
        defaultCostPrice: 35.00,
        defaultSalePrice: 70.00,
        category: 'PERFUME'
    },
    {
        id: 'perfume-100ml',
        name: 'Perfume 100ml',
        size: '100ml',
        defaultCostPrice: 100.00,
        defaultSalePrice: 200.00,
        category: 'PERFUME'
    },
    {
        id: 'moisturizer',
        name: 'Hidratante',
        defaultCostPrice: 25.00,
        defaultSalePrice: 50.00,
        category: 'COSMETIC'
    },
    {
        id: 'bodysplash',
        name: 'Body Splash',
        defaultCostPrice: 30.00,
        defaultSalePrice: 60.00,
        category: 'COSMETIC'
    }
];
