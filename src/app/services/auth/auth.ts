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
  private loggedIn = new BehaviorSubject<boolean>(false);   // Estado de login
  isLoggedIn$ = this.loggedIn.asObservable();

  private premium = new BehaviorSubject<boolean>(false);    // Estado de suscripción
  isPremium$ = this.premium.asObservable();

  // === FIREBASE Y API ===
  private auth?: Auth; 
  private http: HttpClient;
  private BASE_URL = 'https://mi-backend-7c4a.onrender.com'; // 🔗 Tu backend en Render

  // Controla si está cargando el estado premium
  loadingSubscription = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    http: HttpClient
  ) {
    this.http = http;

    if (isPlatformBrowser(this.platformId)) {
      // Inyecta la instancia de Firebase Auth solo en navegador
      this.auth = inject(Auth);

      // Marca como logueado si ya hay token en localStorage
      this.loggedIn.next(this.hasToken());

      // Listener de cambios de sesión (login/logout)
      onAuthStateChanged(this.auth!, (user: User | null) => {
        if (user) {
          // Usuario autenticado
          this.loggedIn.next(true);

          // Revisa el estado premium al loguear
          this.checkPremium(user.uid);
        } else {
          // Usuario deslogueado
          this.loggedIn.next(false);
          this.premium.next(false);
        }
      });
    }
  }

  // === HELPER: Verifica si hay token en localStorage ===
  private hasToken(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken');
  }

  // === CHEQUEO DE PREMIUM (pide al backend la suscripción activa) ===
  private checkPremium(uid: string) {
    this.http.get<{ subscriptionActive: boolean }>(`${this.BASE_URL}/subscription-status/${uid}`)
      .subscribe({
        next: (res) => {
          this.premium.next(res.subscriptionActive);  // Actualiza estado premium
          this.loadingSubscription = false;
        },
        error: (err) => {
          console.error('Error verificando premium:', err);
          this.loadingSubscription = false;
        }
      });
  }

  // === REGISTRO DE USUARIO ===
  async register(email: string, password: string) {
    if (!this.auth) return;
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    // 🔑 Guarda token en localStorage para persistir sesión
    const token = await cred.user.getIdToken();
    localStorage.setItem('authToken', token);

    this.loggedIn.next(true);
    this.checkPremium(cred.user.uid); // Revisar si es premium
    return cred;
  }

  // === LOGIN CON EMAIL ===
  async login(email: string, password: string) {
    if (!this.auth) return;
    const cred = await signInWithEmailAndPassword(this.auth, email, password);

    const token = await cred.user.getIdToken();
    localStorage.setItem('authToken', token);

    this.loggedIn.next(true);
    this.checkPremium(cred.user.uid); // Revisar si es premium
    return cred;
  }

  // === LOGIN CON GOOGLE ===
  async loginWithGoogle() {
    if (!this.auth) return;
    const cred = await signInWithPopup(this.auth, new GoogleAuthProvider());

    const token = await cred.user.getIdToken();
    localStorage.setItem('authToken', token);

    this.loggedIn.next(true);
    this.checkPremium(cred.user.uid); // Revisar si es premium
    return cred;
  }

  // === LOGOUT ===
  async logout() {
    if (!this.auth) return;
    await signOut(this.auth);

    localStorage.removeItem('authToken');
    this.loggedIn.next(false);
    this.premium.next(false);

    // Redirigir al home
    this.router.navigate(['/']);
  }

  // === CONSULTA RÁPIDA: ¿Está autenticado? ===
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  // === REFRESH: Forzar re-chequeo de premium ===
  refreshPremium(uid: string) {
    this.checkPremium(uid);
  }
}
