import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametrosInicialesComponent } from './pages/parametros-iniciales.component';

const routes : Routes = [
    {
        path: '',
        component: ParametrosInicialesComponent,
   /*     children: [
            { path: '', component: ParametrosInicialesComponent},
            { path: '**', redirectTo: 'parametros-iniciales'}
        ]*/
    }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosInicialesRoutingModule { }