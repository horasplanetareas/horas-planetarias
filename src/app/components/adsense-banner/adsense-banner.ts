import { Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';

@Component({
  selector: 'app-adsterra',
  template: `<div class="ad-banner"></div>`,
  styleUrls: ['./adsense-banner.scss']
})
export class AdsterraComponent implements OnInit {
  @Input() key: string = '';
  @Input() width: number = 320;
  @Input() height: number = 50;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
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
