import { Injectable, signal, inject } from '@angular/core';
import { Product } from '../Modals/Product.modal.ts';
import { HttpClient } from '@angular/common/http';
import { map, pipe, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);
  products = signal<Product[]>([]);
  private AllProducts = this.products.asReadonly();

  getAllProducts() {
    return this.AllProducts;
  }

  loadAllProducts() {
    return this.fetchAllProducts(
      'http://localhost:3000/products',
      'Error in loading products'
    ).pipe(
      tap((products) => this.products.set(products)) // ✅ Correct syntax
    );
  }


  fetchAllProducts(url: string, errorMsg: string) {
    return this.httpClient.get<Product[]>(url).pipe(
      tap((products) => console.log('✔ API returned:', products)), // optional
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

addProduct(product: Omit<Product, 'id'>) {
  const currentProducts = this.getAllProducts()(); // unwrapped signal

  const newId = Math.max(...currentProducts.map(p => p.id), 0) + 1;
  const newProduct: Product = { ...product, id: newId };
  return this.httpClient.post<Product>('http://localhost:3000/products', newProduct).pipe(
    catchError((error) => {
      console.error(error);
      return throwError(() => new Error('Failed to add product'));
    }),
    tap(() => {
      // Optionally update the local signal state
      this.products.set([...currentProducts, newProduct]);
    })
  );
}



removeProduct(id: number) {
  return this.httpClient.delete(`http://localhost:3000/products/${id}`).pipe(
    tap(() => {
      // Update local state immediately
      this.products.update(current => current.filter(p => p.id !== id));
    }),
    catchError(error => {
      console.error('Delete failed:', error);
      return throwError(() => new Error('Failed to delete product'));
    })
  );
}

  updateProducts(updatedProduct: Product, id: number) {
    const newId = id.toString();
    return this.httpClient
      .patch('http://localhost:3000/products/' + newId, updatedProduct)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(error));
        })
      );
  }
}
