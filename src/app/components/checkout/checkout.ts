import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { PaymentService } from '../../services/payment/payment.service';
import { AuthService } from '../../services/auth/auth';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { loadStripe } from '@stripe/stripe-js';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class Checkout implements OnInit {

  priceId = 'price_1RtwFvLhmsJ0GMAZxOonMy8k'; // ID del precio de Stripe
  userEmail: string | null = null;
  userUid: string | null = null;
  subscriptionActive = false;

  constructor(
    private paymentService: PaymentService,
    private auth: Auth,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    // Suscribirse al estado de premium
    this.authService.isPremium$.subscribe(active => {
      this.subscriptionActive = active;
      if (active) {
        this.router.navigate(['/lista-horas-por-fecha']);
      }
    });

    // Listener de Firebase Auth
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.userEmail = user.email;
        this.userUid = user.uid;

        // Detecta si venimos de un pago exitoso (Stripe o MercadoPago)
        this.route.queryParams.subscribe(params => {
          if (params['session_id'] || params['mp_status'] === 'success') {
            this.authService.refreshPremium();
            this.router.navigate(['/por-fecha']);
          }
        });
      } else {
        this.userEmail = null;
        this.userUid = null;
      }
    });
  }

  // =========================
  // Pago con Stripe
  // =========================
  async payWithStripe() {
    if (!this.userEmail || !this.userUid) {
      console.error('Usuario no logueado');
      return;
    }

    const stripe = await loadStripe('pk_test_51RtvjCLhmsJ0GMAZVhn9zqqebRDg9GXSu2gIiZNDTCPH51BTth7hGuZSJSCFh0y2adCcC93kz2mgsUSt1OArbfEN00ZRZSFOIo');

    this.paymentService.createStripeCheckout(this.priceId, this.userEmail, this.userUid)
      .subscribe(async (res) => {
        const sessionId = res?.sessionId;
        if (!sessionId) {
          console.error('No se recibió sessionId de Stripe');
          return;
        }

        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) console.error('Error en Stripe:', error.message);
        }
      }, (err) => {
        console.error('Error al crear checkout de Stripe:', err);
      });
  }

  // =========================
  // Pago con MercadoPago
  // =========================
  payWithMercadoPago() {
    if (!this.userUid) {
      console.error('Usuario no logueado');
      return;
    }

    this.paymentService.createMercadoPagoCheckout(this.userUid)
      .subscribe({
        next: (res) => {
          const url = res?.init_point;
          if (!url) {
            console.error('No se recibió init_point de MercadoPago');
            return;
          }

          if (isPlatformBrowser(this.platformId)) {
            window.location.href = url;
          }
        },
        error: (err) => console.error('Error al crear checkout de MercadoPago:', err)
      });
  }
}
