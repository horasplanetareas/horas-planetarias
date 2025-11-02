import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-adsterra',          // 👉 Nombre del selector para usar el componente en plantillas
  standalone: true,                  // 👉 Componente standalone (no necesita declararse en un módulo)
  imports: [CommonModule],           // 👉 Importa CommonModule para usar directivas como *ngIf
  template: `
    <!-- Contenedor del banner -->
    <!-- Solo se muestra si el usuario NO es premium 
    <div *ngIf="!subscriptionActive"
         class="ad-banner"
         [id]="'ad-container-' + key"   
         [style.width.px]="width"       
         [style.height.px]="height">    
    </div>-->
  `,
  styleUrls: ['./adsense-banner.scss'] // 👉 Estilos específicos del banner
})
export class AdsterraComponent implements OnInit {
  // 🔑 Parámetros configurables desde fuera del componente
  @Input() key: string = '';       // Clave única de Adsterra
  @Input() width: number = 320;    // Ancho del banner
  @Input() height: number = 50;    // Alto del banner

  subscriptionActive = false;      // Estado de suscripción (premium o no)

  constructor(
    private renderer: Renderer2,   // 👉 Renderer2 para manipular el DOM de forma segura
    private authService: AuthService // 👉 Servicio de autenticación para saber si es premium
  ) {}

  ngOnInit(): void {
    // 🔍 Nos suscribimos al observable que indica si el usuario es premium
    this.authService.isPremium$.subscribe(active => {
      this.subscriptionActive = active;

      // Si NO es premium, cargamos el banner con un pequeño delay
      if (!this.subscriptionActive) {
        setTimeout(() => this.loadBanner(), 1000); // ⏳ Espera 1s para asegurar que el DOM esté listo
      }
    });
  }

  private loadBanner(): void {
  const containerId = `ad-container-${this.key}`;
  const adDiv = document.getElementById(containerId);
  if (!adDiv) return;

  // 👉 Creamos un iframe que se ajusta al tamaño del contenedor
  const iframe = this.renderer.createElement('iframe');
  this.renderer.setStyle(iframe, 'border', 'none');
  this.renderer.setStyle(iframe, 'width', '100%');    // ocupa todo el contenedor
  this.renderer.setStyle(iframe, 'height', '100%');   // ocupa todo el contenedor
  this.renderer.setStyle(iframe, 'overflow', 'hidden'); // evita scroll interno
  this.renderer.setAttribute(iframe, 'scrolling', 'no'); // quita barras de scroll
  this.renderer.appendChild(adDiv, iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(`
      <script>
        window.atOptions = {
          'key': '${this.key}',
          'format': 'iframe',
          'height': ${this.height},
          'width': ${this.width},
          'params': {}
        };
      <\/script>
      <script src="//www.highperformanceformat.com/${this.key}/invoke.js" async><\/script>
    `);
    doc.close();
  }
}
}