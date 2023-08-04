import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActividadesApiService } from '../../servicios/actividades_api.service';
import { ActividadEntity } from '../../modelos/actividad.interface';
import { ObtenerEspacioFisico } from '../../modelos/espacios-fisicos.interface';
import Swal from 'sweetalert2';

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
  diasLaborables: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

  constructor(
    private route:ActivatedRoute, 
    private actividadService:ActividadesApiService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargarFormulario();
    this.cargarParametro();
    this.cargarActividad(parseInt(this.idActividadRuta));
    console.log(this.actividad)
  }

  cargarFormulario(){
    this.formularioRestriccionesLugarTiempo = this.formBuilder.group({
      espacioFisico:['',[Validators.required]],
      dia:['',[Validators.required]],
      hora:['',[Validators.required]]
    });
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
  cargarHorasDisponibles(){

  }

  crearRestriccion(){
    const restriccion = {
      idActividad: parseInt(this.idActividadRuta),
      idEspacioFisico: this.formularioRestriccionesLugarTiempo.value.espacioFisico.id,
      dia: this.formularioRestriccionesLugarTiempo.value.dia,
      hora: this.formularioRestriccionesLugarTiempo.value.hora
    };
    console.log(restriccion)
    console.log(this.formularioRestriccionesLugarTiempo.value)

    Swal.showLoading();
    this.actividadService.crearUnaRestriccion(restriccion).subscribe(
      {
          next: () => {
              Swal.fire({
                  title: 'Se ha agregado correctamente una restriccion.',
                  icon: 'success',
                  timer: 9500
              }).then( () => {
                  ;
              })
          },
          error: (error) => {
              Swal.fire({
                  icon: 'error',
                  title: 'Error al crear restriccion',
                  text: error.error.message ? error.error.message : "Ha existido un error al crear la actividad",
              })
          }
      }
  )


  }

}
