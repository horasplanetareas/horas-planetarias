import { Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-adsterra-side',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="!subscriptionActive"
         class="ad-side"
         [id]="'ad-container-' + key"
         [style.width.px]="width"
         [style.height.px]="height">
    </div>
  `
})
export class AdsterraSideComponent implements OnInit {
  @Input() key: string = '';
  @Input() width: number = 160;
  @Input() height: number = 600;

  subscriptionActive = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isPremium$.subscribe(active => {
      this.subscriptionActive = active;
      if (!this.subscriptionActive) {
        setTimeout(() => this.loadBanner(), 500);
      }
    });
  }

  private loadBanner(): void {
    const containerId = `ad-container-${this.key}`;
    const adDiv = document.getElementById(containerId);
    if (!adDiv) return;

    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.text = `
      (function() {
        var atOptions = {
          'key' : '${this.key}',
          'format' : 'iframe',
          'height' : ${this.height},
          'width' : ${this.width},
          'params' : {}
        };
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = '//www.highperformanceformat.com/${this.key}/invoke.js';
        s.async = true;
        document.getElementById('${containerId}').appendChild(s);
      })();
    `;
    this.renderer.appendChild(adDiv, script);
  }
}