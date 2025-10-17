import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-adsterra',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="!subscriptionActive"
         class="ad-banner"
         [id]="'ad-container-' + key"
         [style.width.px]="width"
         [style.height.px]="height">
    </div>
  `,
  styleUrls: ['./adsense-banner.scss']
})
export class AdsterraComponent implements OnInit {
  @Input() key: string = '';
  @Input() width: number = 468;
  @Input() height: number = 60;

  subscriptionActive = false;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isPremium$.subscribe(active => {
      this.subscriptionActive = active;
      if (!this.subscriptionActive) {
        setTimeout(() => this.loadBanner(), 1000); // ⏳ más tiempo para asegurar DOM
      }
    });
  }

  private loadBanner(): void {
    const containerId = `ad-container-${this.key}`;
    const adDiv = document.getElementById(containerId);
    if (!adDiv) return;

    // Define atOptions en el global
    const optScript = this.renderer.createElement('script');
    optScript.type = 'text/javascript';
    optScript.text = `
      window.atOptions = {
        'key' : '${this.key}',
        'format' : 'iframe',
        'height' : ${this.height},
        'width' : ${this.width},
        'params' : {}
      };
    `;

    // Carga el script directamente en el contenedor
    const mainScript = this.renderer.createElement('script');
    mainScript.type = 'text/javascript';
    mainScript.src = `//www.highperformanceformat.com/${this.key}/invoke.js`;
    mainScript.async = true;

    this.renderer.appendChild(adDiv, optScript);
    this.renderer.appendChild(adDiv, mainScript);
  }
}