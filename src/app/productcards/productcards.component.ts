import { Component, Input, inject, Output, EventEmitter, DestroyRef } from '@angular/core';
import { Product } from '../Modals/Product.modal.ts';
import { ProductService } from '../Services/products.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productcards',
  imports: [FormsModule],
  templateUrl: './productcards.component.html',
  styleUrl: './productcards.component.css',
})
export class ProductcardsComponent {
  @Input() product!: Product;
  @Output() closeAddModal = new EventEmitter<void>();
  @Input() isAddModal!: boolean;
  isEditModalOpen: boolean = false;
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef)
  selectedProduct!: Product;
  isAddMode = false;

  editProduct: Product = {
    id: 0,
    name: '',
    category: '',
    stock: 0,
    minStock: 0,
    price: 0,
  };

  onEdit() {
    // Clone the current product into a local editable object
    this.editProduct = { ...this.product };
    this.isEditModalOpen = true;
  }

  closeModal() {
    this.isEditModalOpen = false;
  }

  saveChanges(): void {
    if (this.isAddModal) {
      const { id, ...newProduct } = this.editProduct; // ✅ Strip ID for new items
      this.productService.addProduct(newProduct);

      const subscription = this.productService.addProduct(newProduct as Product).subscribe({
        next: () => {
          this.closeModal();
          this.closeAddModal.emit();
        },
        error: (err) => console.error('Add failed', err),
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe())
    } else {
      this.productService
        .updateProducts(this.editProduct, this.editProduct.id)
        .subscribe({
          next: () => {
            this.closeModal();
          },
          error: (err) => console.error('Update failed', err),
        });
          }
  }

onDelete() {
  if (confirm('Are you sure you want to delete this product?')) {
    const subscription = this.productService.removeProduct(this.product.id).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        // No need to manually update - signal already updated via tap()
      },
      error: (err) => console.error('Delete failed:', err)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
}
