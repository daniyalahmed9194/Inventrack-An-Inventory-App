export interface Order {
  id: number;
  quantity: number;
  date: string; // ISO string
  status: 'Pending' | 'Shipped' | 'Delivered';
}