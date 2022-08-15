import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modulos/login/login/login.component';
import { BienvenidoComponent } from './modulos/main/bienvenido/bienvenido.component';
import { MainComponent } from './modulos/main/main.component';
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
        path: 'espacios_fisicos',
        loadChildren: () => import("./modulos/espacios-fisicos/espacios-fisicos.module")
          .then(m => m.EspaciosFisicosModule)
      },
      {
        path: 'docentes',
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
