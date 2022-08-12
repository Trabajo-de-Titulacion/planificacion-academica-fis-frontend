import { Component } from "@angular/core";
import Semestre from "../models/semestre.interface";
import { SemestreService } from "../services/semestre.service";


@Component({
    selector: 'app-parametros-iniciales',
    templateUrl: './parametros-iniciales.component.html',
    styleUrls: ['./paremtros-iniciales.component.scss']
})
export class ParametrosInicialesComponent{

    semestres : Semestre[] = []
    semestreSeleccionado? : Semestre

    constructor(
        private servicioSemestre : SemestreService
    ) {}

    ngOnInit(): void {
        this.servicioSemestre.obtenerSemestres().subscribe(
            data => {
                this.semestres = data;
            }
        )
    }
}