import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../Services/products.service';
import { ProductcardsComponent } from '../productcards/productcards.component';
import { NavbarComponent } from "../shared/navbar/navbar.component";


@Component({
  selector: 'app-products',
  imports: [ProductcardsComponent, NavbarComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  isAddModal = signal<boolean>(false);

  products = this.productService.getAllProducts();

  constructor() {
    effect(() => {
      console.log('Signal updated:', this.products());
    });
  }
  private destroyRef = inject(DestroyRef);
  ngOnInit(): void {
    const allProducts = this.productService.loadAllProducts().subscribe({
      next: () => console.log('Products loaded'),
      error: (err) => console.error('Failed to load products', err),
    });

    this.destroyRef.onDestroy(() => allProducts.unsubscribe());
  }
  onCloseAddModal() {
    this.isAddModal.set(false); // 👈 Parent controls the signal
  }
  openAddModal(): void {
    this.isAddModal.set(true);
  }


}
