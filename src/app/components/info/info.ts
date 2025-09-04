import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-info',
  templateUrl: './info.html',
  styleUrls: ['./info.scss']
})
export class Info implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit(): void {
    // 🔹 Cambiar el título de la pestaña
    this.titleService.setTitle('Horas Planetarias | Astrología y Energía Planetaria');

    // 🔹 Cambiar meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre qué son las horas planetarias, cómo se calculan y cómo influencian tu vida a través de la astrología.'
    });

    // 🔹 Otras meta tags opcionales
    this.metaService.updateTag({
      name: 'keywords',
      content: 'horas planetarias, astrología, energía planetaria, calcular horas, tiempo astrológico, planetas regentes'
    });

    // 🔹 Open Graph tags (para compartir en redes sociales)
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
      content: 'https://horas-planetarias.vercel.app/assets/images/planet.jpg'  // Asegúrate de poner una URL válida para la imagen
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://horas-planetarias.vercel.app/info'
    });

    // 🔹 Twitter Card Tags (para compartir en Twitter)
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
  }

}
