import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizarDocentesComponent } from './componentes/visualizar-docentes/visualizar-docentes.component';
import { VisualizarHorarioComponent } from '../horarios/componentes/visualizar-horario/visualizar-horario.component';
import { VisualizarHorarioDocenteComponent } from './componentes/visualizar-horario-docente/visualizar-horario-docente.component';
const routes: Routes = [
    {
        path: 'horario-docente/:id',
        component: VisualizarHorarioDocenteComponent,
    },
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
