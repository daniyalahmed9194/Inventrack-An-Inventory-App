import { Injectable, signal, inject } from '@angular/core';
import { Product } from '../Modals/Product.modal.ts';
import { HttpClient } from '@angular/common/http';

import { pipe, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private allProducts = signal<Product[]>([]);
  private httpClient = inject(HttpClient);

  private loadAllProducts = this.allProducts.asReadonly();

  fetchAllProducts(url: string, errorMsg: string) {
    return this.httpClient.get<{ products: Product[] }>(url).pipe(
      map((resProds) => resProds.products),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
