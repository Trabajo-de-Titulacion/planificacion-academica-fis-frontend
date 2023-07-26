import { Component, OnInit } from "@angular/core";
import { ExperimentacionService } from "../../servicios/experimentacion_api.service";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'app-vizualizar-experimentacion',
    templateUrl: './vizualizar-experimentacion.component.html',
    styleUrls: ['./vizualizar-experimentacion.component.scss']

})

export class VizualizarExperimentacionComponent implements OnInit{
    constructor(private experimentacionService:ExperimentacionService){}
   
    nombre:string ='';
    estudiantes:object[] =[{}];
    universidad: string = 'Escuela Politécnica Nacional'
    datosEstudiantesTable = new MatTableDataSource<any>([]);
    columnasTabla: string[] = ["nombre", "calificacion"]
    
    ngOnInit(): void {
        this.cargarInfo();
        this.cargarNombre();
    }

    cargarNombre(){
        this.experimentacionService
            .obtenerInfoExperimentacion()
            .subscribe({
                next:(data)=>{
                    console.log(data);
                    //@ts-ignore
                    this.nombre = data.name;
                }
            });
    }

    cargarInfo(){
        this.experimentacionService
            .obtenerInfo()
            .subscribe({
                next:(data)=>{
                    console.log(data);
                    //@ts-ignore
                    this.estudiantes = data
                },
                complete:()=>{
                    this.datosEstudiantesTable.data=this.estudiantes;
                }
            })
    }
}