import { Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-adsterra',
  imports: [
    CommonModule,
  ],
  templateUrl: './adsense-banner.html',
  styleUrls: ['./adsense-banner.scss']
})
export class AdsterraComponent implements OnInit {
  @Input() key: string = '';
  @Input() width: number = 320;
  @Input() height: number = 50;

  subscriptionActive = false;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.isPremium$.subscribe(active => {this.subscriptionActive = active;});
    console.log('Subscription active:', this.subscriptionActive);
    this.loadBanner();
  }

  private loadBanner(): void {
    const container = this.el.nativeElement.querySelector('.ad-banner');
    if (!container) return;

    const optScript = this.renderer.createElement('script');
    optScript.type = 'text/javascript';
    optScript.text = `
      atOptions = {
        'key' : '${this.key}',
        'format' : 'iframe',
        'height' : ${this.height},
        'width' : ${this.width},
        'params' : {}
      };
    `;

    const mainScript = this.renderer.createElement('script');
    mainScript.type = 'text/javascript';
    mainScript.src = `//www.highperformanceformat.com/${this.key}/invoke.js`;

    this.renderer.appendChild(container, optScript);
    this.renderer.appendChild(container, mainScript);
  }
}
