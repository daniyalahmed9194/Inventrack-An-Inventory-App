import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { SupplierService } from '../Services/suppliers.service';
import { Suppliers } from '../Modals/suppliers.modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-suppliers',
  imports: [FormsModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css',
})
export class SuppliersComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private destroyRef = inject(DestroyRef);
  suppliers = this.supplierService.getAllSuppliers();
  isEditModal = signal(false);
  isAddModal = signal(false);
  selectedSupplierId = signal<number | null>(null);

  ngOnInit(): void {
    const subs = this.supplierService.loadAllSuppliers().subscribe({
      next: () => console.log('Suppliers loaded'),
      error: (err) => console.error('Failed to load suppliers', err),
    });
    this.destroyRef.onDestroy(() => subs.unsubscribe());
  }

  editSupplier: Suppliers = {
    id: 0,
    name: '',
    contact: '',
    phone: '',
  };

  onSave() {
    if (this.isAddModal()) {
      const { id, ...newSupplier } = this.editSupplier;
      this.supplierService.addNewSupplier(newSupplier);

      const subscription = this.supplierService
        .addNewSupplier(newSupplier as Suppliers)
        .subscribe({
          next: () => {
            console.log('added successfully');
          },
          error: (err) => console.log(err),
        });

      this.isAddModal.set(false);
    } else {
      if (this.selectedSupplierId()) {
        const subs = this.supplierService
          .updateSuppliers(this.editSupplier, this.selectedSupplierId()!)
          .subscribe({
            next: () => {
              this.supplierService.loadAllSuppliers().subscribe();
              this.resetForm();
              this.isEditModal.set(false);
            },
            error: (err) => console.error('Update failed', err),
          });
        this.destroyRef.onDestroy(() => subs.unsubscribe());
      }
    }
  }
  onEdit(supplier: Suppliers) {
    this.editSupplier = { ...supplier };
    this.selectedSupplierId.set(supplier.id);
    this.isEditModal.set(true);
  }
  onDelete(supplier: Suppliers) {
    this.supplierService.removeSupplier(supplier.id).subscribe({
      error: (err) => console.error('Delete error:', err),
    });
  }
  onAdd() {
    this.isAddModal.set(true);
  }
  onCancel() {
    this.isAddModal.set(false);
    this.isEditModal.set(false);
  }
  private resetForm() {
    this.editSupplier = { id: 0, name: '', contact: '', phone: '' };
    this.selectedSupplierId.set(null);
  }
}
