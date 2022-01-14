import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ReservasComponent } from './reservas/reservas.component';
import { VuelosComponent } from './vuelos/vuelos.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    children: [
      {
        path: '',
        redirectTo: 'vuelos',
        pathMatch: 'full',
      },
      {
        path: 'vuelos',
        component: VuelosComponent,
      },
      {
        path: 'reservas',
        component: ReservasComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
