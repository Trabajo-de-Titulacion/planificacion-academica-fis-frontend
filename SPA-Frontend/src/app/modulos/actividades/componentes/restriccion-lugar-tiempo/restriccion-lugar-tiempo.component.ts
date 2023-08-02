import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActividadesApiService } from '../../servicios/actividades_api.service';
import { ActividadEntity } from '../../modelos/actividad.interface';
import { ObtenerEspacioFisico } from '../../modelos/espacios-fisicos.interface';

@Component({
  selector: 'app-restriccion-lugar-tiempo',
  templateUrl: './restriccion-lugar-tiempo.component.html',
  styleUrls: ['./restriccion-lugar-tiempo.component.scss']
})
export class RestriccionLugarTiempoComponent implements OnInit {

  formularioRestriccionesLugarTiempo: FormGroup = new FormGroup({});

  idActividadRuta:string='';

  actividad : ActividadEntity = {};

  espaciosFisicosDisponibles: ObtenerEspacioFisico[] = []

  espacioFisicoSeleccionado?:ObtenerEspacioFisico = { id:'', nombre:'', aforo: 0}

  constructor(private route:ActivatedRoute, private actividadService:ActividadesApiService) { }

  ngOnInit(): void {
    this.cargarParametro();
    this.cargarActividad(parseInt(this.idActividadRuta));
    console.log(this.actividad)
    
   
  }

  cargarParametro(){
    this.route.params.subscribe(
      (params)=>{
        this.idActividadRuta = params['id'];
        
      }
    )
  }

  cargarActividad(id:number){
    let actividad: ActividadEntity = {} 

    this.actividadService.obtenerActividadporId(id).subscribe({
      next: (data)=>{
        actividad = data;
      },
      complete: ()=>{
        this.actividad = actividad
        console.log(this.actividad.id);
        //
        this.cargarEspaciosFisicos(this.actividad.tipoAula?.id!!)
      }
    })
  
  }

  cargarEspaciosFisicos(id:string){
    let espacioFisico: ObtenerEspacioFisico[] = [] 

    this.actividadService.obtenerEspaciosFisicosPorTipoDeAula(id).subscribe({
      next: (data)=>{
        espacioFisico = data;
      },
      complete: ()=>{
        this.espaciosFisicosDisponibles = espacioFisico
        //onsole.log(this.espaciosFisicosDisponibles.id);
      }
    })
  }

  seleccionarEspacio(){

  }

}
