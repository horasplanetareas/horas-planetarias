import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // === ESTADOS REACTIVOS ===
  private loggedIn = new BehaviorSubject<boolean>(false);   // ✅ Usuario logueado
  isLoggedIn$ = this.loggedIn.asObservable();
  private premium = new BehaviorSubject<boolean>(false);    // ✅ Usuario con premium
  isPremium$ = this.premium.asObservable();
  public loadingSubscription: boolean = true;
  // === FIREBASE Y API ===
  private auth?: Auth; 
  private http: HttpClient;
  private BASE_URL = 'https://mi-backend-7c4a.onrender.com'; // 🔗 Tu backend en Render
  // Controla si ya se verificó el estado premium (evita requests innecesarios)
  private premiumChecked = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    http: HttpClient
  ) {
    this.http = http;
    if (isPlatformBrowser(this.platformId)) {
      // ✅ Inyecta Firebase Auth SOLO en el navegador (evita errores en SSR)
      this.auth = inject(Auth);
      // ✅ Si ya había token, arranca como logueado
      this.loggedIn.next(this.hasToken());
      // ✅ Listener de cambios de sesión (cuando Firebase detecta login/logout)
      onAuthStateChanged(this.auth!, async (user: User | null) => {
        if (user) {
          this.loggedIn.next(true);
          // 🔑 Guardamos/actualizamos el token seguro en localStorage
          const token = await user.getIdToken(true);
          localStorage.setItem('authToken', token);
          // ⚡ Verificamos premium SOLO si aún no lo hicimos en esta sesión
          if (!this.premiumChecked) {
            this.checkPremium(user.uid, token);
          }
        } else {
          // ✅ Al desloguear, limpiamos todo
          this.loggedIn.next(false);
          this.premium.next(false);
          this.premiumChecked = false;
          localStorage.removeItem('authToken');
        }
      });
    }
  }

  // === HELPER: Verifica si hay token en localStorage ===
  private hasToken(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken');
  }

  // === CHEQUEO DE PREMIUM (con seguridad: token enviado en headers) ===
  private checkPremium(uid: string, token: string) {
    this.http.get<{ subscriptionActive: boolean }>(
      `${this.BASE_URL}/subscription-status/${uid}`,
      { headers: { Authorization: `Bearer ${token}` } } // 🔒 Seguridad extra
    ).subscribe({
      next: (res) => {
        this.premium.next(res.subscriptionActive);
        this.premiumChecked = true; // ✅ Evita repetir la request
        this.loadingSubscription = false; // Termina el loading
      },
      error: (err) => {
        console.error('Error verificando premium:', err);
        this.premiumChecked = false; // Permite reintentar si falla
        this.loadingSubscription = false; // Termina el loading
      }
    });
  }

  // === REGISTRO DE USUARIO ===
  async register(email: string, password: string) {
    if (!this.auth) return;
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const token = await cred.user.getIdToken();
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);
    this.checkPremium(cred.user.uid, token);
    return cred;
  }

  // === LOGIN CON EMAIL ===
  async login(email: string, password: string) {
    if (!this.auth) return;
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const token = await cred.user.getIdToken();
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);
    this.checkPremium(cred.user.uid, token);
    return cred;
  }

  // === LOGIN CON GOOGLE ===
  async loginWithGoogle() {
    if (!this.auth) return;
    const cred = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const token = await cred.user.getIdToken();
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);
    this.checkPremium(cred.user.uid, token);
    return cred;
  }

  // === LOGOUT ===
  async logout() {
    if (!this.auth) return;
    await signOut(this.auth);
    localStorage.removeItem('authToken');
    this.loggedIn.next(false);
    this.premium.next(false);
    this.premiumChecked = false;
    this.router.navigate(['/']); // Redirige al home
  }

  // === CONSULTA RÁPIDA: ¿Está autenticado? ===
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  // === REFRESH MANUAL: Forzar re-chequeo de premium ===
  async refreshPremium() {
    if (!this.auth || !this.auth.currentUser) return;
    const token = await this.auth.currentUser.getIdToken(true);
    this.checkPremium(this.auth.currentUser.uid, token);
  }
}
