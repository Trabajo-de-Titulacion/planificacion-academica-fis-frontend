import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VisualizarExperimentacionComponent } from "./components/visualizar-experimentacion.component";

const routes: Routes = [
    {
        path: '',
        component: VisualizarExperimentacionComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})
export class ExperimentacionRoutingModule {

} 