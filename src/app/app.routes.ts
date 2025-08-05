import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HoraActualComponent } from './components/hora-actual/hora-actual';
import { PlanetaList } from './components/planeta-list/planeta-list';
import { PlanetaDetalleComponent } from './components/planeta-detalle/planeta-detalle';
import { PlanetaPorFecha } from './components/planeta-por-fecha/planeta-por-fecha';
import { LoginComponent } from './components/user/login/login';
import { RegisterComponent } from './components/user/register/register';
import { authGuard } from './guards/auth-guard'; // ⬅ importar el guard

export const routes: Routes = [
  { path: '', redirectTo: 'hora-actual', pathMatch: 'full' },
  { path: 'hora-actual', component: HoraActualComponent },
  { path: 'lista-horas', component: PlanetaList },
  { path: 'detalle-hora', component: PlanetaDetalleComponent },
  { 
    path: 'por-fecha',
    component: PlanetaPorFecha,
    canActivate: [authGuard] // ⬅ proteger la ruta
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  //{ path: '**', redirectTo: 'hora-actual' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
