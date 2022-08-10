import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ParametrosInicialesComponent } from "./pages/parametros-iniciales.component";
import { ParametrosInicialesRoutingModule } from "./parametros-inciales-routing.module";


@NgModule({
    declarations: [ParametrosInicialesComponent],
    imports: [
        CommonModule,
        ParametrosInicialesRoutingModule
    ]
})
export class ParametrosInicialesModule {}