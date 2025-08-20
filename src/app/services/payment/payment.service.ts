import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private BASE_URL = 'https://mi-backend.onrender.com';

  constructor(private http: HttpClient) {}

  createStripeCheckout(priceId: string, email: string, uid: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/stripe-checkout`, { priceId, email, uid });
  }

  createMercadoPagoCheckout(uid: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/mp-checkout`, { uid });
  }
}
