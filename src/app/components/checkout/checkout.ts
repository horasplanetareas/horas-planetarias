import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { PaymentService } from '../../services/payment/payment.service';
import { AuthService } from '../../services/auth/auth';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class Checkout implements OnInit {
  priceId = 'price_1RtwFvLhmsJ0GMAZxOonMy8k';
  userEmail: string | null = null;
  userUid: string | null = null;
  subscriptionActive = false;

  constructor(
    private paymentService: PaymentService,
    private auth: Auth,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService
  ) { }

  ngOnInit() {
    this.seo.updateMeta(
      'Plan Premium | Horas Planetarias',
      'Activa tu suscripción premium y accede a contenido exclusivo.'
    );

    this.authService.isPremium$.subscribe(active => {
      this.subscriptionActive = active;
      if (active) this.router.navigate(['/lista-horas-por-fecha']);
    });

    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.userEmail = user.email;
        this.userUid = user.uid;

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

  payWithMercadoPago() {
    if (!this.userUid || !this.userEmail) return;

    this.paymentService.createMercadoPagoSubscription(this.userUid, this.userEmail)
      .subscribe({
        next: (res) => {
          const url = res?.init_point;
          if (!url) return;
          if (isPlatformBrowser(this.platformId)) window.location.href = url;
        },
        error: (err) => console.error('Error al crear suscripción de MercadoPago:', err)
      });
  }
  payWithPayPal() {
  if (!this.userUid || !this.userEmail) return;

  this.paymentService.createPayPalSubscription(this.userUid, this.userEmail)
    .subscribe({
      next: (res) => {
        const url = res?.approveUrl;
        if (!url) return;
        if (isPlatformBrowser(this.platformId)) window.location.href = url;
      },
      error: (err) => console.error("Error al crear suscripción PayPal:", err)
    });
}

}
