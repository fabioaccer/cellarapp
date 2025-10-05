export const formatCurrency = (value: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(value);
};

export const formatBRL = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};