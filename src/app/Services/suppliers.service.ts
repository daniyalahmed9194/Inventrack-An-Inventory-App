import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, throwError, catchError, pipe } from 'rxjs';
import { Suppliers } from '../Modals/suppliers.modal';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  suppliers = signal<Suppliers[]>([]);
  private httpClient = inject(HttpClient);
  private allSuppliers = this.suppliers.asReadonly();
  getAllSuppliers() {
    return this.allSuppliers;
  }

  // addNewSupplier(supplier: Omit<Suppliers, 'id'>) {
  //   const currentSuppliers = this.getAllSuppliers()();
  //   const newId = Math.max(...currentSuppliers.map((s) => s.id), 0) + 1;
  //   const newSupplier: Suppliers = { ...supplier, id: newId };
  //   return this.httpClient
  //     .post('http://localhost:3000/suppliers', newSupplier)
  //     .pipe(
  //       (tap((supplier) => console.log(supplier, ' added')), // optional
  //       catchError((error) => {
  //         console.log(error);
  //         return throwError(() => new Error(error));
  //       }))
  //     );
  // }

  addNewSupplier(supplier: Omit<Suppliers, 'id'>) {
    const currentSuppliers = this.suppliers();
    const newId = Math.max(...currentSuppliers.map((s) => s.id), 0) + 1;
    const newSupplier: Suppliers = { ...supplier, id: newId };

    return this.httpClient
      .post<Suppliers>('http://localhost:3000/suppliers', newSupplier)
      .pipe(
        tap((addedSupplier) => {
          // Update local state immediately
          this.suppliers.update((current) => [...current, addedSupplier]);
          console.log('Supplier added:', addedSupplier);
        }),
        catchError((error) => {
          console.error('Add failed:', error);
          return throwError(() => new Error(error));
        })
      );
  }
  loadAllSuppliers() {
    return this.fetchAllSuppliers(
      'http://localhost:3000/suppliers',
      'didnt load'
    ).pipe(tap((suppliers) => this.suppliers.set(suppliers)));
  }

  fetchAllSuppliers(url: string, errorMsg: string) {
    return this.httpClient.get<Suppliers[]>(url).pipe(
      tap((suppliers) => console.log('✔ API returned:', suppliers)), // optional
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
  updateSuppliers(updatedSuppliers: Suppliers, id: number) {
    const newId = id.toString();
    return this.httpClient
      .patch('http://localhost:3000/suppliers/' + newId, updatedSuppliers)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(error));
        })
      );
  }


  removeSupplier(id: number) {
  return this.httpClient.delete(`http://localhost:3000/suppliers/${id}`).pipe(
    tap(() => {
      // Update local signal
      this.suppliers.update(current => current.filter(s => s.id !== id));
      console.log('Successfully deleted');
    }),
    catchError(error => {
      console.error('Delete failed:', error);
      return throwError(() => new Error('Failed to delete supplier'));
    })
  );
}

  // removeSupplier(id: number) {
  //   const newId = id.toString();
  //   this.httpClient.delete('http://localhost:3000/suppliers/' + newId).pipe(
  //     tap(() => {
  //       // Update local signal
  //       this.suppliers.update((current) => current.filter((s) => s.id !== id));
  //       console.log('Successfully deleted');
  //     }),
  //     catchError((error) => {
  //       console.error('Delete failed:', error);
  //       return throwError(() => new Error('Failed to delete supplier'));
  //     })
  //   );
  // }


}
