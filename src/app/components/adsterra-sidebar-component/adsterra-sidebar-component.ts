import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-adsterra-side',
  template: `<div class="ad-side"></div>`,
  styleUrls: ['./adsterra-sidebar-component.scss'],
  host: {
    '[class.left]': "position === 'left'",
    '[class.right]': "position === 'right'"
  }
})
export class AdsterraSideComponent implements OnInit {
  @Input() position: 'left' | 'right' = 'left';
  @Input() key: string = '';
  @Input() width: number = 160;
  @Input() height: number = 600;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadSideAd();
  }

  private loadSideAd(): void {
    const container = this.el.nativeElement.querySelector('.ad-side');
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
    mainScript.src = '//www.highperformanceformat.com/a62e36fa17c52d5e8975d96d3641beb0/invoke.js';

    this.renderer.appendChild(container, optScript);
    this.renderer.appendChild(container, mainScript);
  }
}
