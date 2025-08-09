import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private backendUrl = 'https://stripe-backend-beige.vercel.app/api/create-checkout';

  constructor(private http: HttpClient, private auth: Auth) {}

  async startCheckout(priceId: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Debes iniciar sesión');

    return this.http.post<any>(this.backendUrl, {
      priceId,
      uid: currentUser.uid
    }).toPromise();
  }
}
