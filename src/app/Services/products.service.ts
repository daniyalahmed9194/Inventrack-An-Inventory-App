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

  //   loadAllProducts() {
  //     return this.fetchAllProducts(
  //       'http://localhost:3000/products',
  //       'Error in loading products'
  //     ).pipe(tap({ next: (products) => this.products.set(products) }));
  //   }

  loadAllProducts() {
    return this.fetchAllProducts(
      'http://localhost:3000/products',
      'Error in loading products'
    ).pipe(
      tap((products) => this.products.set(products)) // ✅ Correct syntax
    );
  }

  //   fetchAllProducts(url: string, errorMsg: string) {
  //     return this.httpClient.get<{ products: Product[] }>(url).pipe(
  //       map((resProds) => resProds.products),
  //       catchError((error) => {
  //         console.log(error);
  //         return throwError(() => new Error(errorMsg));
  //       })
  //     );
  //   }

  fetchAllProducts(url: string, errorMsg: string) {
    return this.httpClient.get<Product[]>(url).pipe(
      tap((products) => console.log('✔ API returned:', products)), // optional
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  addProduct(product: Product) {
  return this.httpClient.post<Product>('http://localhost:3000/products', product).pipe(
    catchError((error) => {
      console.error(error);
      return throwError(() => new Error('Failed to add product'));
    })
  );
}


  removeProduct(id: number) {
    const newId = id.toString();
    return this.httpClient
      .delete('http://localhost:3000/products/' + newId)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(error));
        })
      );
  }

  updateProducts(updatedProduct: Product, id: number) {
    const newId = id.toString();
    return this.httpClient
      .post('http://localhost:3000/products' + newId, updatedProduct)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(error));
        })
      );
  }
}
