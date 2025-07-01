import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
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
    if (this.isAddMode) {
      this.productService.addProduct(this.editProduct).subscribe({
        next: () => {
          this.closeModal();
          this.productService.loadAllProducts().subscribe();
        },
        error: (err) => console.error('Add failed', err),
      });
    } else {
      this.productService.updateProducts(this.editProduct, this.editProduct.id).subscribe({
        next: () => {
          this.closeModal();
          this.productService.loadAllProducts().subscribe();
        },
        error: (err) => console.error('Update failed', err),
      });
    }
  }


  onDelete() {
    const id = 1;
    this.productService.removeProduct(id).subscribe({
      next: () => console.log('product deleted'),
      error: (err) => {
        console.error('not deleted', err);
      },
    });
  }
}
