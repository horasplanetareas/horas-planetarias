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
  ) { }

  // MercadoPago Suscripción
  createMercadoPagoSubscription(uid: string, email: string): Observable<{ init_point: string }> {
    return this.http.post<{ init_point: string }>(`${this.BASE_URL}/mp-subscription`, { uid, email });
  }

  // Estado de suscripción
  getSubscriptionStatus(uid: string, token?: string): Observable<{ subscriptionActive: boolean }> {
    return this.http.get<{ subscriptionActive: boolean }>(
      `${this.BASE_URL}/subscription-status/${uid}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
  }

  // Redirigir a MP
  redirectToMercadoPago(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = url;
    }
  }

  async createMercadoPagoSubscriptionAsync(uid: string, email: string) {
    return firstValueFrom(this.createMercadoPagoSubscription(uid, email));
  }

  // PayPal Suscripción
  createPayPalSubscription(uid: string, email: string) {
    return this.http.post<{ approveUrl: string }>(`${this.BASE_URL}/paypal-subscription`, { uid, email });
  }

}
