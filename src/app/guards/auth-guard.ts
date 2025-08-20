import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const firestore = inject(Firestore);

  // 1️⃣ Verificar login
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const uid = localStorage.getItem('uid');
  if (!uid) {
    router.navigate(['/login']);
    return false;
  }

  // 2️⃣ Revisar cache en localStorage
  const cached = localStorage.getItem('subscriptionActive');
  if (cached === 'true') return true;
  if (cached === 'false') {
    router.navigate(['/checkout']);
    return false;
  }

  // 3️⃣ Consultar Firestore si no hay cache
  try {
    const userRef = doc(firestore, 'users', uid);
    const userSnap = await getDoc(userRef);

    const isActive = userSnap.exists() && userSnap.data()['subscriptionActive'] === true;

    // Guardar cache
    localStorage.setItem('subscriptionActive', isActive ? 'true' : 'false');

    if (isActive) return true;
    router.navigate(['/checkout']);
    return false;

  } catch (err) {
    console.error('Error verificando suscripción en Firestore:', err);
    router.navigate(['/checkout']);
    return false;
  }
};
