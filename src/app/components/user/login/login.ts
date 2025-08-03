import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  RouterModule, Router} from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // lógica de autenticación con Firebase aquí
      console.log('Login exitoso:', this.form.value);
    }
  }

  get username() {
  return this.form.get('username');
}
get password() {
  return this.form.get('password');
}

}
