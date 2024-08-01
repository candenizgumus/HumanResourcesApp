export const numberFormat = (number: number, notation: 'standard' | 'compact' = 'standard') =>
  new Intl.NumberFormat('en-US', {
    notation,
  }).format(number);

export const currencyFormat = (amount: number, options: Intl.NumberFormatOptions = {}) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'usd',
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    ...options,
  }).format(amount);
};

export const getTotal = (data: number[]) => {
  return data.reduce((total, current) => total + current, 0);
};
