import { Component,  } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { MenuComponent } from './components/menu/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent,MenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Horas';
}
