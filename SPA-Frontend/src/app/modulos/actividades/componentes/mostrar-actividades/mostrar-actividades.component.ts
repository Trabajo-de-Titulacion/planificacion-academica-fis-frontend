import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearActividadDialogComponent } from '../crear-actividad-dialog/crear-actividad-dialog.component';

@Component({
  selector: 'app-mostrar-actividades',
  templateUrl: './mostrar-actividades.component.html',
  styleUrls: ['./mostrar-actividades.component.scss']
})
export class MostrarActividadesComponent implements OnInit, AfterViewInit {

  constructor(
    public dialog: MatDialog,

  ) { }
  ngAfterViewInit(): void {
    //  throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    //  throw new Error('Method not implemented.');
  }

  abrirCrearActividadDialog() {
    const dialogRef = this.dialog.open(CrearActividadDialogComponent, {
      width: '100%',
      data: {
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      //  TODO:  this.obtenerTipoAulas();
    })
  }


}
