import { DataSource } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
import Semestre from '../../models/semestre.interface';
import { TipoAula } from '../../models/tipo-aula.interface';
import { TiposAulasApiService } from '../../services/tipos-aulas-api.service';
import { CrearTipoAulaDialogComponent } from './crear-tipo-aula-dialog/crear-tipo-aula-dialog.component';
import { EditarTipoAulaDialogComponent } from './editar-tipo-aula-dialog/editar-tipo-aula-dialog.component';



const DATA: TipoAula[] = [
  {tipo: 'Aula regular', facultad: { nombre: 'Facultad de Ingeniería de Sistemas'}},
  {tipo: 'Laboratorio', facultad: { nombre: 'Facultad de Ingeniería de Sistemas' }},
];


@Component({
  selector: 'app-tipo-aulas',
  templateUrl: './tipo-aulas.component.html',
  styleUrls: ['./tipo-aulas.component.scss', '../../styles/common.scss']
})
export class TipoAulasComponent implements OnInit {

  @Input() semestre? : Semestre;

  constructor(
    private servicioTiposAulas : TiposAulasApiService,
    public dialog: MatDialog

  ) { }

  displayedColumns: string[] = ['Tipo de aula', 'Facultad', 'Acciones'];
  dataSource : TipoAula[] = []

  ngOnInit(): void {
    this.obtenerTipoAulas();
  }

  obtenerTipoAulas(){
    this.servicioTiposAulas.obtenerTipoAulas().subscribe(
      resp  => {
        this.dataSource = resp;
      }
    )
  }

  eliminarTipoAula(id : string){
    console.log(id)
    Swal.fire({
      title: '¿Está seguro de eliminar el tipo de aula ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioTiposAulas.eliminarTipoAula(id).subscribe(
          {
            next: () => {
              Swal.fire(
                'Eliminado',
                'Se ha eliminado correctamente el tipo de aula.',
                'success'
              )
              this.obtenerTipoAulas();
            },
            error: err => {
              Swal.fire({
                icon: 'error',
                title: 'No se ha podido eliminar el tipo de aula.',
              })
            }
          }
        );
      }
    })
  }

  abrirCrearTipoAulaDialog(){
    const dialogRef = this.dialog.open(CrearTipoAulaDialogComponent, {
      width: '30rem',
      data: {}
    })

    dialogRef.afterClosed().subscribe( result => {
      this.obtenerTipoAulas();
    })
  }

  abrirEditarTipoAulaDialog(tipoAula : TipoAula){
    const dialogRef = this.dialog.open(EditarTipoAulaDialogComponent, {
      width: '30rem',
      data: tipoAula
    })
    dialogRef.afterClosed().subscribe( result => {
      this.obtenerTipoAulas();
    })
  }

}
