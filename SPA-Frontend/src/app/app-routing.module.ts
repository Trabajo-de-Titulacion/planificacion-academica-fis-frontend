import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modulos/login/login/login.component';
import { BienvenidoComponent } from './modulos/main/bienvenido/bienvenido.component';
import { MainComponent } from './modulos/main/main.component';
import { ParametrosInicialesComponent } from './modulos/parametros-inciales/pages/parametros-iniciales.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'spa',
    component: MainComponent,
    children: [
      {
        path: '',
        component: BienvenidoComponent,
      },
      {
        path: 'parametros-iniciales',
        loadChildren: () => import('./modulos/parametros-inciales/paremetros-iniciales.module').then( m => m.ParametrosInicialesModule),
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'spa',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true}), ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
