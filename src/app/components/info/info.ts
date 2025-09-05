import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-info',
  templateUrl: './info.html',
  styleUrls: ['./info.scss']
})
export class Info implements OnInit {

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    // 🔹 SEO tags
    this.titleService.setTitle('Horas Planetarias | Astrología y Energía Planetaria');

    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre qué son las horas planetarias, cómo se calculan y cómo influencian tu vida a través de la astrología.'
    });

    this.metaService.updateTag({
      name: 'keywords',
      content: 'horas planetarias, astrología, energía planetaria, calcular horas, tiempo astrológico, planetas regentes'
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'Horas Planetarias | Astrología y Energía Planetaria'
    });

    this.metaService.updateTag({
      property: 'og:description',
      content: 'Conoce las horas planetarias y su influencia en las actividades diarias a través de la astrología.'
    });

    this.metaService.updateTag({
      property: 'og:image',
      content: 'https://horas-planetarias.vercel.app/assets/images/planet.jpg'
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://horas-planetarias.vercel.app/info'
    });

    this.metaService.updateTag({
      name: 'twitter:title',
      content: 'Horas Planetarias | Astrología y Energía Planetaria'
    });

    this.metaService.updateTag({
      name: 'twitter:description',
      content: 'Explora cómo las horas planetarias y su relación con los planetas pueden mejorar tu vida diaria.'
    });

    this.metaService.updateTag({
      name: 'twitter:image',
      content: 'https://horas-planetarias.vercel.app/assets/images/planet.jpg'
    });

    // 🔹 Fix para scroll a fragmentos (#id)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.route.snapshot.fragment;
        if (fragment) {
          setTimeout(() => {
            // opcional: si tenés header fijo, podés dar offset:
            // this.viewportScroller.setOffset([0, 80]);
            this.viewportScroller.scrollToAnchor(fragment);
          }, 0);
        }
      });
  }
}
