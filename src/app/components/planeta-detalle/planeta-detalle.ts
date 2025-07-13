import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planeta-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planeta-detalle.html',
  styleUrls: ['./planeta-detalle.scss']
})
export class PlanetaDetalleComponent {
  planeta: any;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.planeta = nav?.extras.state?.['planeta'];
  }
}
