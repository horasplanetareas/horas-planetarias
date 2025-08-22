import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private BASE_URL = 'https://mi-backend-7c4a.onrender.com';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // 👈 Para chequear si estamos en navegador
  ) {}

  /**
   * Crear checkout de Stripe
   * @param priceId ID del precio en Stripe
   * @param email Email del usuario
   * @param uid UID del usuario
   */
  createStripeCheckout(priceId: string, email: string, uid: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/stripe-checkout`, { priceId, email, uid });
  }

  /**
   * Crear checkout de MercadoPago
   * @param uid UID del usuario
   */
  createMercadoPagoCheckout(uid: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/mp-checkout`, { uid });
  }

  /**
   * Consultar estado de suscripción del usuario
   * @param uid UID del usuario
   */
  getSubscriptionStatus(uid: string) {
    return this.http.get<{ subscriptionActive: boolean }>(
      `${this.BASE_URL}/subscription-status/${uid}`
    );
  }

  /**
   * Redirigir a MercadoPago solo si estamos en navegador
   */
  redirectToMercadoPago(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = url;
    }
  }
}
