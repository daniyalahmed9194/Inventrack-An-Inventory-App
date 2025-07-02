import { Component, effect, signal , inject} from '@angular/core';
import { Order } from '../Modals/order.modal';
import { OrderService } from '../Services/orders.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true, 
  imports: [DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  private orderService = inject(OrderService);

  // local signal (read-only wrapper around service signal)
  orders = this.orderService.getAllOrders();

  constructor() {
    // Load orders on component init
    this.orderService.loadAllOrders().subscribe();

    // Optional: log any signal updates (dev/debug only)
    effect(() => {
      console.log('📦 Orders Updated:', this.orders());
    });
  }



  editOrder(order: Order) {
    console.log('✏️ Edit clicked for order:', order);
    // Open modal or navigate to form (based on your app flow)
  }

  deleteOrder(id: number) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.removeOrder(id).subscribe({
        next: () => console.log('✅ Order deleted:', id),
        error: (err) => console.error('❌ Delete failed', err),
      });
    }
  }
}
