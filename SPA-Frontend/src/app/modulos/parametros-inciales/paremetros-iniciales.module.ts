import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table"
import { MatTabsModule } from "@angular/material/tabs"
import { NgModule } from "@angular/core";



import { JornadaLaboralComponent } from './components/jornada-laboral/jornada-laboral.component';
import { ParametrosInicialesComponent } from "./pages/parametros-iniciales.component";
import { ParametrosInicialesRoutingModule } from "./parametros-inciales-routing.module";
import { TipoAulasComponent } from './components/tipo-aulas/tipo-aulas.component';


@NgModule({
    declarations: [
        JornadaLaboralComponent,
        ParametrosInicialesComponent,
        TipoAulasComponent,
    ],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        ParametrosInicialesRoutingModule,
    ]
})
export class ParametrosInicialesModule { }