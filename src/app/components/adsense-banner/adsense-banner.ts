import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adsense-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adsense-banner.html'
})
export class AdsenseBannerComponent implements OnInit, AfterViewInit {

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Error al cargar AdSense:', e);
    }
  }
}
