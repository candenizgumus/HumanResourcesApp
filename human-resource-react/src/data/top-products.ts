export interface Product {
  id: number;
  name: string;
  color: string;
  sales: number;
}

export const topProducts: Product[] = [
  { id: 1, name: 'Home Decor Range', color: 'info.main', sales: 45 },
  { id: 2, name: 'Disney Princess Pink Bag 18', color: 'success.main', sales: 29 },
  { id: 3, name: 'Bathroom Essentials', color: 'secondary.dark', sales: 18 },
  { id: 4, name: 'Apple Smartwatches', color: 'warning.dark', sales: 25 },
];
