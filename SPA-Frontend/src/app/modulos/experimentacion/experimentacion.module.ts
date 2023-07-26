import { NgModule } from "@angular/core";
import { VizualizarExperimentacionComponent } from "./components/vizualizar-experimentacion/vizualizar-experimentacion.component";
import { CommonModule } from "@angular/common";
import { ExperimentacionRoutingModule } from "./experimentacion-routing.module";
import { ExperimentacionService } from "./servicios/experimentacion_api.service";
import {MatTableModule} from '@angular/material/table';


@NgModule({
    declarations: [VizualizarExperimentacionComponent],
    imports: [CommonModule, ExperimentacionRoutingModule, MatTableModule],
    providers:[ExperimentacionService]
})
export class ExperimentacionModule{

}
