import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modulos/login/login/login.component';
import { BienvenidoComponent } from './modulos/main/bienvenido/bienvenido.component';
import { MainComponent } from './modulos/main/main.component';
import { EsCoordinadorGuard } from './servicios/auth/guards/es-coordinador.guard';
import { EsDocenteGuard } from './servicios/auth/guards/es-docente.guard';
import { EsGestorEspaciosFisicosGuard } from './servicios/auth/guards/es-gestor-espacios.guard';
import { LoggedGuard } from './servicios/auth/guards/logged.guard';

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
    canActivate: [LoggedGuard],
    children: [
      {
        path: '',
        component: BienvenidoComponent,
      },
      {
        path: 'parametros-iniciales',
        canActivateChild: [EsCoordinadorGuard],
        loadChildren: () => import('./modulos/parametros-iniciales/paremetros-iniciales.module')
          .then( m => m.ParametrosInicialesModule),
      },
      {
        path: 'espacios_fisicos',
        canActivateChild: [EsGestorEspaciosFisicosGuard],
        loadChildren: () => import("./modulos/espacios-fisicos/espacios-fisicos.module")
          .then(m => m.EspaciosFisicosModule)
      },
      {
        path: 'horas_no_disponibles',
        canActivateChild: [EsDocenteGuard],
        loadChildren: () => import("./modulos/horas-no-disponibles/horas-no-disponibles.module")
          .then(m => m.HorasNoDisponiblesModule)
      },
      {
        path: 'docentes',
        canActivateChild: [EsCoordinadorGuard],
        loadChildren: () => import("./modulos/docentes/docentes.module")
          .then(m => m.DocentesModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'spa',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
