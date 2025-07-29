import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HoraActualComponent } from './components/hora-actual/hora-actual';
import { PlanetaList } from './components/planeta-list/planeta-list';
import { PlanetaDetalleComponent} from './components/planeta-detalle/planeta-detalle';
import { PlanetaPorFecha } from './components/planeta-por-fecha/planeta-por-fecha';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: 'hora-actual', component: HoraActualComponent },
  { path: 'lista-horas', component: PlanetaList },
  { path: '', redirectTo: 'hora-actual', pathMatch: 'full' },
  { path: 'detalle-hora', component: PlanetaDetalleComponent },
  { path: 'por-fecha', component: PlanetaPorFecha },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'hora-actual' } // manejo de ruta no encontrada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }