import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';

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
  sentCode: string = '123456'; // Podés quitar esto si no vas a usar verificación ficticia
  inputCode: string = '';
  codeSent = false;
  codeError = false;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.auth.register(email, password)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(err => {
        console.error(err);
        alert('Error al registrar: ' + err.message);
      });
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
    this.auth.loginWithGoogle()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.error(err);
        alert('Error con Google: ' + err.message);
      });
  }
}
