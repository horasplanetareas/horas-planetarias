import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { MenuComponent } from './components/menu/menu';
import { AdsenseBannerComponent } from "./components/adsense-banner/adsense-banner";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    MenuComponent,
    AdsenseBannerComponent
  ],
  templateUrl: './app.html',
  styleUrl:'./app.scss'
})
export class App {
  protected title = 'Horas';
}
