import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActividadesApiService } from '../../servicios/actividades_api.service';
import { ActividadEntity } from '../../modelos/actividad.interface';
import { ObtenerEspacioFisico } from '../../modelos/espacios-fisicos.interface';
import Swal from 'sweetalert2';
import { obtenerRestriccion } from '../../modelos/restriccion-actividad.interface';
import { MatTableDataSource } from '@angular/material/table';

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

  restriccionePorActividad :obtenerRestriccion[] = [];

  //Referencias para tabla
  datosRestriccionesTable = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['aulaActividad', 'diaActividad', 'horaActividad', 'acciones'];
  //@ViewChild('tablaSort') tablaSort = new MatSort();

  constructor(
    private route:ActivatedRoute, 
    private actividadService:ActividadesApiService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargarFormulario();
    this.cargarParametro();
    this.cargarActividad(parseInt(this.idActividadRuta));
    this.cargarRestricciones(parseInt(this.idActividadRuta))
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
          complete:()=>{
            this.cargarRestricciones(parseInt(this.idActividadRuta));
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

  cargarRestricciones(idActividad:number){
    this.actividadService
      .obtenerRestriccionesPorId(idActividad)
      .subscribe({
        next: (data)=>{
          this.restriccionePorActividad = data;
        },
        complete:()=>{
          this.datosRestriccionesTable.data = this.restriccionePorActividad;
        }
    }) 
  }

  eliminarRestriccion(idRestriccion:number){
    Swal.fire({
      title: 'Esta seguro de elimanar esta restricción?',
      text: "No se podra revertir estos cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actividadService
          .eliminarRestriccionPorId(idRestriccion)
          .subscribe({
            next:()=>{
              console.log("Test eliminar")
            },
            complete:()=>{
              this.datosRestriccionesTable.data = this.restriccionePorActividad;
              this.cargarRestricciones(parseInt(this.idActividadRuta));
              Swal.fire(
                'Restricción eliminada!',
                'Se ha eliminado correctamente la restricción',
                'success'
              )
            },
            error:(error)=>{
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar restriccion',
                text: error.error.message ? error.error.message : "Ha existido un error al crear la actividad",
              })
            }
          })
      }
    })
  }

}
