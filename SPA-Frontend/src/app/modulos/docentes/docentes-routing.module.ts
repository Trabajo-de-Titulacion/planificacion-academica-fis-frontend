import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizarDocentesComponent } from './componentes/visualizar-docentes/visualizar-docentes.component';
const routes: Routes = [
    {
        path: '',
        component: VisualizarDocentesComponent
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocentesRoutingModule { }
