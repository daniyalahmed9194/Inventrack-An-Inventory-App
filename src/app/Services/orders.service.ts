import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../Modals/order.modal'; // Make sure this model exists
import { tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  private ordersSignal = signal<Order[]>([]);
  private readonlyOrders = this.ordersSignal.asReadonly();

  getAllOrders() {
    return this.readonlyOrders;
  }

  loadAllOrders() {
    return this.http.get<Order[]>('http://localhost:3000/orders').pipe(
      tap((orders) => {
        this.ordersSignal.set(orders);
        console.log('✔ Orders loaded:', orders);
      }),
      catchError((error) => {
        console.error('❌ Failed to load orders', error);
        return throwError(() => new Error('Failed to load orders'));
      })
    );
  }

  addNewOrder(order: Omit<Order, 'id'>) {
    const currentOrders = this.ordersSignal();
    const newId = Math.max(...currentOrders.map((o) => o.id), 0) + 1;
    const newOrder: Order = { ...order, id: newId };

    return this.http.post<Order>('http://localhost:3000/orders', newOrder).pipe(
      tap((addedOrder) => {
        this.ordersSignal.update((orders) => [...orders, addedOrder]);
        console.log('➕ Order added:', addedOrder);
      }),
      catchError((error) => {
        console.error('❌ Add order failed:', error);
        return throwError(() => new Error('Failed to add order'));
      })
    );
  }

  updateOrder(updatedOrder: Order, id: number) {
    return this.http
      .patch<Order>(`http://localhost:3000/orders/${id}`, updatedOrder)
      .pipe(
        tap((response) => {
          this.ordersSignal.update((current) =>
            current.map((order) =>
              order.id === id ? { ...order, ...response } : order
            )
          );
          console.log('✏️ Order updated:', response);
        }),
        catchError((error) => {
          console.error('❌ Update failed:', error);
          return throwError(() => new Error('Failed to update order'));
        })
      );
  }

  removeOrder(id: number) {
    return this.http.delete(`http://localhost:3000/orders/${id}`).pipe(
      tap(() => {
        this.ordersSignal.update((orders) =>
          orders.filter((o) => o.id !== id)
        );
        console.log('🗑️ Order deleted:', id);
      }),
      catchError((error) => {
        console.error('❌ Delete failed:', error);
        return throwError(() => new Error('Failed to delete order'));
      })
    );
  }
}
