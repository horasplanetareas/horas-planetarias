import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule],
  providers: [FormBuilder]
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  mode = 'register';
  sentCode: string = '123456'; // código simulado
  inputCode: string = '';
  codeSent: boolean = false;
  codeError: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.codeSent = true;
      console.log('Enviando código de confirmación a:', this.form.value.email);
    }
  }

  confirmCode() {
    if (this.inputCode === this.sentCode) {
      console.log('Código confirmado. Registro completo.');
      this.router.navigate(['/login']);
    } else {
      this.codeError = true;
    }
  }
  get email() {
  return this.form.get('email');
}
get username() {
  return this.form.get('username');
}
get password() {
  return this.form.get('password');
}

loginWithGoogle() {
  // Implementá tu lógica con Firebase Auth o lo que uses
  console.log('Iniciar registro con Google');
}
}
