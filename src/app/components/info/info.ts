import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.html',
  styleUrls: ['./info.scss']
})
export class Info implements OnInit {

  constructor(
    private seo: SeoService,
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.seo.updateMeta(
      'Horas Planetarias | Astrología y Energía Planetaria',
      'Descubre qué son las horas planetarias, cómo se calculan y cómo influencian tu vida.'
    );

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        setTimeout(() => this.viewportScroller.scrollToAnchor(fragment), 0);
      }
    });
  }
}
