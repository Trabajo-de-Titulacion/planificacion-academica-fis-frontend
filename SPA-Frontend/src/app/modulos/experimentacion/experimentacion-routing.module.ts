import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VizualizarExperimentacionComponent } from "./components/vizualizar-experimentacion/vizualizar-experimentacion.component";

const routes: Routes = [
    {
        path:'',
        component: VizualizarExperimentacionComponent,
    },

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExperimentacionRoutingModule{}