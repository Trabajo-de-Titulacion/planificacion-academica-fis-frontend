import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { ParametrosInicialesComponent } from "./pages/parametros-iniciales.component";
import { ParametrosInicialesRoutingModule } from "./parametros-inciales-routing.module";
import { JornadaLaboralComponent } from './components/jornada-laboral/jornada-laboral.component';
import { TipoAulasComponent } from './components/tipo-aulas/tipo-aulas.component';


@NgModule({
    declarations: [ParametrosInicialesComponent, JornadaLaboralComponent, TipoAulasComponent],
    imports: [
        CommonModule,
        ParametrosInicialesRoutingModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatListModule,
        MatInputModule
    ]
})
export class ParametrosInicialesModule {}