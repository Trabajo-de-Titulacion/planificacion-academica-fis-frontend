import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Facultad } from '../../../models/facultad.interface';
import { TipoAula } from '../../../models/tipo-aula.interface';
import { FacultadesApiService } from '../../../services/facultades-api.service';
import { TiposAulasApiService } from '../../../services/tipos-aulas-api.service';

@Component({
  selector: 'app-editar-tipo-aula-dialog',
  templateUrl: './editar-tipo-aula-dialog.component.html',
  styleUrls: ['./../crear-tipo-aula-dialog/crear-tipo-aula-dialog.component.scss']
})
export class EditarTipoAulaDialogComponent implements OnInit {

  facultades: Facultad[] = []
  facultadSeleccionada = ""
  formularioTiposAulas: FormGroup = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<EditarTipoAulaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TipoAula,
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
    const facultad = this.facultades.filter(facultad => facultad.id === this.data.facultad.id)[0];
    const valorInicial = '';
    this.formularioTiposAulas = this.fb.group({
      facultad: [facultad, [Validators.required]],
      tipoAula: [this.data.tipo, [Validators.required]],
    });
  }

  editarTipoAula(){

    const facultad : Facultad = this.formularioTiposAulas.get('facultad')?.value;
    if(this.formularioTiposAulas.valid && facultad.id && this.data.id){
         const tipoAula = {
          tipo: this.formularioTiposAulas.get('tipoAula')?.value,
          idFacultad: facultad.id,
        }
        this.tipoAulaServicio.actualizarTipoAula(tipoAula, this.data.id).subscribe(
          {
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Actualización exitosa',
                text: `Se ha actualizado correctamente el tipo de aula ${tipoAula.tipo.toUpperCase()} de la ${facultad.nombre.toUpperCase()}.`,
              }).then(
                _ => {
                  this.dialogRef.close();
                }
              )
      
            },
            error: err => {
              Swal.fire({
                icon: 'error',
                title: 'No se ha podido crear el tipo de aula.',
              })
            }
          }
        );
      }
  }
}
