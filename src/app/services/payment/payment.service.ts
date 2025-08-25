import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private BASE_URL = 'https://mi-backend-7c4a.onrender.com';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Crear checkout de Stripe
   * @param priceId ID del precio en Stripe
   * @param email Email del usuario
   * @param uid UID del usuario
   */
  createStripeCheckout(priceId: string, email: string, uid: string): Observable<{ sessionId: string }> {
    return this.http.post<{ sessionId: string }>(`${this.BASE_URL}/stripe-checkout`, { priceId, email, uid });
  }

  /**
   * Crear checkout de MercadoPago
   * @param uid UID del usuario
   */
  createMercadoPagoCheckout(uid: string): Observable<{ init_point: string }> {
    return this.http.post<{ init_point: string }>(`${this.BASE_URL}/mp-checkout`, { uid });
  }

  /**
   * Consultar estado de suscripción del usuario
   * @param uid UID del usuario
   */
  getSubscriptionStatus(uid: string, token?: string): Observable<{ subscriptionActive: boolean }> {
    return this.http.get<{ subscriptionActive: boolean }>(
      `${this.BASE_URL}/subscription-status/${uid}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
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

  /**
   * Version async/await para usar con async/await
   */
  async createStripeCheckoutAsync(priceId: string, email: string, uid: string) {
    return firstValueFrom(this.createStripeCheckout(priceId, email, uid));
  }

  async createMercadoPagoCheckoutAsync(uid: string) {
    return firstValueFrom(this.createMercadoPagoCheckout(uid));
  }
}
