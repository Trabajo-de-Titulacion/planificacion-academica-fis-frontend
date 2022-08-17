import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Facultad } from '../../../models/facultad.interface';
import { FacultadesApiService } from '../../../services/facultades-api.service';

@Component({
  selector: 'app-crear-tipo-aula-dialog',
  templateUrl: './crear-tipo-aula-dialog.component.html',
  styleUrls: ['./crear-tipo-aula-dialog.component.scss']
})
export class CrearTipoAulaDialogComponent implements OnInit {

  facultades : Facultad[] = []
  facultadSeleccionada = ""

  constructor(
    public dialogRef : MatDialogRef<CrearTipoAulaDialogComponent>,
    private facultadServicio : FacultadesApiService,
  ) { }

  async ngOnInit() {
    await this.obtenerFacultades()
  }

  onNoClick() : void {
    this.dialogRef.close();
  }

  async obtenerFacultades(){
     this.facultades = await lastValueFrom<Facultad[]>(this.facultadServicio.obtenerFacultades());
  }
 

}
