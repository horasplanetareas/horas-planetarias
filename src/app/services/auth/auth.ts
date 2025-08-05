import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  private auth?: Auth; // ya no lo inyectamos en el constructor

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Inyección perezosa: solo en navegador
      this.auth = inject(Auth);
      this.loggedIn.next(this.hasToken());
    }
  }

  private hasToken(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken');
  }

  async register(email: string, password: string) {
    if (!this.auth) return;
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const token = await cred.user.getIdToken();
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);
    return cred;
  }

  async login(email: string, password: string) {
    if (!this.auth) return;
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const token = await cred.user.getIdToken();
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);
    return cred;
  }

  async loginWithGoogle() {
    if (!this.auth) return;
    const cred = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const token = await cred.user.getIdToken();
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);
    return cred;
  }

  async logout() {
    if (!this.auth) return;
    await signOut(this.auth);
    localStorage.removeItem('authToken');
    this.loggedIn.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
