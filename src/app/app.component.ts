import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductcardsComponent } from './productcards/productcards.component';
import { ProductsComponent } from './products/products.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, ProductsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Inventrack-An-Inventory-App';
}
