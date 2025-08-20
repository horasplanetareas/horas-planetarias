import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment/payment.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {

  priceId = 'price_1234';
  email = 'usuario@correo.com';
  uid = 'abc123'; // UID de Firebase del usuario logueado

  constructor(private paymentService: PaymentService) {}

  payWithStripe() {
    this.paymentService.createStripeCheckout(this.priceId, this.email, this.uid)
      .subscribe({
        next: (res) => window.location.href = `https://checkout.stripe.com/pay/${res.sessionId}`,
        error: (err) => console.error(err)
      });
  }

  payWithMercadoPago() {
    this.paymentService.createMercadoPagoCheckout(this.uid)
      .subscribe({
        next: (res) => window.location.href = res.init_point,
        error: (err) => console.error(err)
      });
  }
}
