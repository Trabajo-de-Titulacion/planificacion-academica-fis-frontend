import { Component, OnInit } from "@angular/core";
import { ExperimentacionService } from "./services/experimentacion_api.service";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'app-visualizar-experimentacion',
    templateUrl: './visualizar-experimentacion.component.html',
    styleUrls: ['./visualizar-experimentacion.component.scss']
})
export class VisualizarExperimentacionComponent implements OnInit {

    constructor(private experimentacionService: ExperimentacionService){
    }

    nombre: string = "";
    estudiantes: Array<object> = [{}]

    datosEstudiantesTabla = new MatTableDataSource<any>([]);

    columnasTabla: Array<string> = ["nombre","calificacion"]

    universidad: string = "Escuela Politecnica Nacional"

    ngOnInit(): void {
        this.cargarNombre()
        this.cargarInfo()
    }

    cargarNombre(){
        //llamar al servicio
        this.experimentacionService.obtenerInfoExperimentacion().subscribe({
            next: (data) => {
                console.log(data);
                //@ts-ignore
                this.nombre = data!!.name;
            }
        })

    }

    cargarInfo(){
        this.experimentacionService.obtenerInfo().subscribe({
            next: (data) => {
                console.log(data);
                //@ts-ignore
                this.estudiantes = data!!;
                //this.datosEstudiantesTabla.data.push(this.estudiantes)
            },

            complete: () => {
                this.datosEstudiantesTabla.data = this.estudiantes;
            }
        })
    }
    

}