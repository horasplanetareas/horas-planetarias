import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule  } from '@angular/forms';
import {  RouterModule, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [ ReactiveFormsModule, FormsModule, RouterModule, CommonModule ],
  providers: [FormBuilder]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  mode = 'login';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // lógica de autenticación con Firebase aquí
      console.log('Login exitoso:', this.form.value);
    }
  }

   get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

}
