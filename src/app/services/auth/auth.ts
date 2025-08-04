import { Injectable } from '@angular/core';
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
  // Estado reactivo: los componentes se pueden suscribir a esto
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  // Observable público para que otros componentes lo usen
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private auth: Auth) {}

  // Revisa si hay token en el localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
      return cred.user.getIdToken().then(token => {
        localStorage.setItem('authToken', token);
        this.loggedIn.next(true); // Actualiza el estado reactivo
        return cred;
      });
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then(cred => {
      return cred.user.getIdToken().then(token => {
        localStorage.setItem('authToken', token);
        this.loggedIn.next(true);
        return cred;
      });
    });
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider()).then(cred => {
      return cred.user.getIdToken().then(token => {
        localStorage.setItem('authToken', token);
        this.loggedIn.next(true);
        return cred;
      });
    });
  }

  logout() {
    return signOut(this.auth).then(() => {
      localStorage.removeItem('authToken');
      this.loggedIn.next(false); // Notifica logout
    });
  }

  // Método sincrónico para validaciones rápidas
  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
