import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Facultad } from '../../../models/facultad.interface';
import { FacultadesApiService } from '../../../services/facultades-api.service';
import { TiposAulasApiService } from '../../../services/tipos-aulas-api.service';

@Component({
  selector: 'app-crear-tipo-aula-dialog',
  templateUrl: './crear-tipo-aula-dialog.component.html',
  styleUrls: ['./crear-tipo-aula-dialog.component.scss']
})
export class CrearTipoAulaDialogComponent implements OnInit {

  facultades: Facultad[] = []
  facultadSeleccionada = ""
  formularioTiposAulas: FormGroup = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<CrearTipoAulaDialogComponent>,
    private facultadServicio: FacultadesApiService,
    private tipoAulaServicio : TiposAulasApiService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    await this.obtenerFacultades()
    this.crearFormulario();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async obtenerFacultades() {
    this.facultades = await lastValueFrom<Facultad[]>(this.facultadServicio.obtenerFacultades());
  }

  private crearFormulario() {
    const facultadSistemas = this.facultades.filter(facultad => facultad.nombre.toUpperCase().includes("SISTEMAS"))[0];
    const valorInicial = '';
    if(facultadSistemas){
      this.formularioTiposAulas = this.fb.group({
        facultad: [facultadSistemas, [Validators.required]],
        tipoAula: [valorInicial, [Validators.required]],
      });
    }else{
      this.formularioTiposAulas = this.fb.group({
        facultad: [valorInicial, [Validators.required]],
        tipoAula: [valorInicial, [Validators.required]],
      });
    }
  }

  crearTipoAula(){
    if(this.formularioTiposAulas.valid){
         const tipoAula = {
          tipo: this.formularioTiposAulas.get('tipoAula')?.value,
          idFacultad: this.formularioTiposAulas.get('facultad')?.value.id,
        }
        this.tipoAulaServicio.crearTipoAula(tipoAula);
      }
  }
}
