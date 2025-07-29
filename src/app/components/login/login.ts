import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auth',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, RouterModule ],
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);

  form = this.fb.group({
    email: ['', [Validators.email]],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  codeSent = false;
  sentCode = '';
  inputCode = '';
  codeError = false;

  constructor() {
    this.route.url.subscribe(segments => {
      this.mode = segments[0]?.path === 'register' ? 'register' : 'login';

      if (this.mode === 'login') {
        this.form.controls.email.clearValidators();
        this.form.controls.email.updateValueAndValidity();
      } else {
        this.form.controls.email.setValidators([Validators.required, Validators.email]);
        this.form.controls.email.updateValueAndValidity();
      }
    });
  }

  onSubmit() {
    if (this.mode === 'login') {
      if (this.form.valid) {
        localStorage.setItem('token', 'fake-token');
        this.router.navigate(['/']);
      }
    } else {
      if (this.form.valid && !this.codeSent) {
        this.sentCode = Math.floor(100000 + Math.random() * 900000).toString();
        this.codeSent = true;
        this.codeError = false;
        alert(`Código enviado a ${this.form.value.email}: ${this.sentCode}`);
      }
    }
  }

  confirmCode() {
    if (this.inputCode === this.sentCode) {
      localStorage.setItem('token', 'fake-token');
      this.router.navigate(['/']);
    } else {
      this.codeError = true;
    }
  }
}
