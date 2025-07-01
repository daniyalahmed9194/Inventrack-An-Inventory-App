import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../Services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);
  private loginService = inject(LoginService)
  private router = inject(Router)
 

  onSubmit(formData: NgForm){
    const email = formData.value.email; 
    const password = formData.value.password;
    const newUser: {email: string, password: string}= {
      email, password
    };
    this.loginService.addNewUser(newUser)
    console.log(this.loginService.allUsers())
    const success = this.loginService.login(email, password);
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid credentials');
    }
    formData.reset()
  }
}
