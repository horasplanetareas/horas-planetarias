import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private BASE_URL = 'https://mi-backend-7c4a.onrender.com';

  constructor(private http: HttpClient) { }

  // Crear checkout de Stripe
  createStripeCheckout(priceId: string, email: string, uid: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/stripe-checkout`, { priceId, email, uid });
  }

  // Crear checkout de MercadoPago
  createMercadoPagoCheckout(uid: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/mp-checkout`, { uid });
  }

  getSubscriptionStatus(uid: string) {
  return this.http.get<{ subscriptionActive: boolean }>(`${this.BASE_URL}/subscription-status/${uid}`);
}
}
