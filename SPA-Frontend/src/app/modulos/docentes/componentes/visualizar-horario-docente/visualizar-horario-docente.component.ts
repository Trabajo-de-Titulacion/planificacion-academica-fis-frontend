import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-visualizar-horario-docente',
    templateUrl: './visualizar-horario-docente.component.html',
    styleUrls: ['./visualizar-horario-docente.component.scss']
})
export class VisualizarHorarioDocenteComponent implements OnInit {

    constructor(private route: ActivatedRoute){
    }

    idDocente: String = ""

    ngOnInit(): void {
        this.cargarParametro()
    }

    //Recuperar el Id de la ruta
    cargarParametro(){
        this.route.params.subscribe(
            (params) => {
                this.idDocente = params['id']
            }
        )
    }
}