import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SeoService {
  defaultTitle = 'Horas Planetarias';
  defaultDescription = 'Consulta las horas planetarias y su influencia según astrología.';
  defaultImage = 'https://horas-planetarias.vercel.app/assets/KAIROS.png';
  defaultUrl = 'https://horas-planetarias.vercel.app';

  constructor(private title: Title, private meta: Meta, private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setGlobalMeta();
      });
  }

  setGlobalMeta() {
    this.title.setTitle(this.defaultTitle);
    this.meta.updateTag({ name: 'description', content: this.defaultDescription });
    this.meta.updateTag({ name: 'keywords', content: 'horas planetarias, astrología, planetas, energía' });
    this.meta.updateTag({ property: 'og:title', content: this.defaultTitle });
    this.meta.updateTag({ property: 'og:description', content: this.defaultDescription });
    this.meta.updateTag({ property: 'og:image', content: this.defaultImage });
    this.meta.updateTag({ property: 'og:url', content: this.defaultUrl });
    this.meta.updateTag({ name: 'twitter:title', content: this.defaultTitle });
    this.meta.updateTag({ name: 'twitter:description', content: this.defaultDescription });
    this.meta.updateTag({ name: 'twitter:image', content: this.defaultImage });
  }

  // Permite sobrescribir meta tags por página
  updateMeta(title?: string, description?: string, image?: string, url?: string) {
    this.title.setTitle(title || this.defaultTitle);
    this.meta.updateTag({ name: 'description', content: description || this.defaultDescription });
    this.meta.updateTag({ property: 'og:title', content: title || this.defaultTitle });
    this.meta.updateTag({ property: 'og:description', content: description || this.defaultDescription });
    this.meta.updateTag({ property: 'og:image', content: image || this.defaultImage });
    this.meta.updateTag({ property: 'og:url', content: url || this.defaultUrl });
    this.meta.updateTag({ name: 'twitter:title', content: title || this.defaultTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description || this.defaultDescription });
    this.meta.updateTag({ name: 'twitter:image', content: image || this.defaultImage });
  }
}
