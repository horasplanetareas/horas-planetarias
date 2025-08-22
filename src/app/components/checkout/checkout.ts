import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment/payment.service';
import { AuthService } from '../../services/auth/auth';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { loadStripe } from '@stripe/stripe-js';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class Checkout implements OnInit {

  // ID del precio de Stripe que queremos cobrar
  priceId = 'price_1RtwFvLhmsJ0GMAZxOonMy8k';

  // Variables para guardar info del usuario logueado
  userEmail: string | null = null;
  userUid: string | null = null;
  subscriptionActive = false; // 🔹 estado de suscripción

  constructor(
    private paymentService: PaymentService,
    private auth: Auth,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    
    this.authService.isPremium$.subscribe(active => {
      this.subscriptionActive = active;
      if (active) {
        this.router.navigate(['/lista-horas-por-fecha']);
      }
    });

    // Escuchar cambios en la sesión de Firebase
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        // Si hay usuario, guardamos email y uid
        this.userEmail = user.email;
        this.userUid = user.uid;

        // Escuchar query params para detectar si venimos de un pago exitoso
        this.route.queryParams.subscribe(params => {
          // Si recibimos session_id (Stripe) o mp_status=success (MercadoPago)
          if (params['session_id'] || params['mp_status'] === 'success') {
            // Refrescar el estado premium en AuthService
            this.authService.refreshPremium(user.uid);
            // Redirigir a la página de /por-fecha después de actualizar
            this.router.navigate(['/por-fecha']);
          }
        });

      } else {
        // Si no hay usuario logueado, limpiamos las variables
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
      return; // No se puede pagar si no hay usuario
    }

    // Cargar Stripe.js con tu public key
    const stripe = await loadStripe('pk_test_51RtvjCLhmsJ0GMAZVhn9zqqebRDg9GXSu2gIiZNDTCPH51BTth7hGuZSJSCFh0y2adCcC93kz2mgsUSt1OArbfEN00ZRZSFOIo');
    // Crear la sesión de checkout en el backend
    this.paymentService.createStripeCheckout(this.priceId, this.userEmail, this.userUid)
      .subscribe(async (res) => {
        if (stripe) {
          // Redirigir al checkout de Stripe
          const { error } = await stripe.redirectToCheckout({ sessionId: res.sessionId });
          if (error) console.error('Stripe error:', error.message);
        }
      });
  }

  // =========================
  // Pago con MercadoPago
  // =========================
  payWithMercadoPago() {
    if (!this.userUid) {
      console.error('Usuario no logueado');
      return; // No se puede pagar si no hay usuario
    }

    // Crear la preferencia de pago en backend
    this.paymentService.createMercadoPagoCheckout(this.userUid)
      .subscribe({
        next: (res) => {
          // Redirigir al init_point de MercadoPago
          window.location.href = res.init_point;
          // La actualización de premium y la redirección se hace al regresar de success_url
        },
        error: (err) => console.error(err)
      });
  }
}
