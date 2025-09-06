import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';
import { SeoService } from '../../../services/seo/seo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule],
  providers: [FormBuilder]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    // 🔹 Configuración SEO usando SeoService
    this.seo.updateMeta(
      'Iniciar Sesión | Horas Planetarias',
      'Accede a tu cuenta para consultar tus horas planetarias personalizadas.'
      // dejamos image y url undefined para usar la global KAIROS.png
    );

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.auth.login(email, password)
        .then(() => this.router.navigate(['/hora-actual']))
        .catch(err => {
          console.error(err);
          alert('Error al iniciar sesión: ' + err.message);
        });
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {
        this.router.navigate(['/hora-actual']);
      })
      .catch(err => {
        console.error(err);
        alert('Error con Google: ' + err.message);
      });
  }
}
