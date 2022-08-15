import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActualizarDocenteComponent } from './componentes/actualizar-docente/actualizar-docente.component';
import { CrearDocenteComponent } from './componentes/crear-docente/crear-docente.component';
import { VisualizarDocentesComponent } from './componentes/visualizar-docentes/visualizar-docentes.component';
const routes: Routes = [
    {
        path: 'crear',
        component: CrearDocenteComponent,
    },
    {
        path: 'actualizar',
        component: ActualizarDocenteComponent,
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
