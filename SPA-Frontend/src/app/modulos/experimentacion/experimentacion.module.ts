import { NgModule } from "@angular/core";
import { VisualizarExperimentacionComponent } from "./components/visualizar-experimentacion.component";
import { CommonModule } from "@angular/common";
import { ExperimentacionRoutingModule } from "./experimentacion-routing.module";
import { ExperimentacionService } from "./components/services/experimentacion_api.service";
import { MatTableModule } from "@angular/material/table";

@NgModule({
    declarations: [VisualizarExperimentacionComponent],
    imports: [CommonModule, ExperimentacionRoutingModule, MatTableModule],
    providers: [ExperimentacionService]
})
export class ExperimentacionModule {
    
}
