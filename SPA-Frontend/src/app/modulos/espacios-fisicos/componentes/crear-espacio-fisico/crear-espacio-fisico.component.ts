import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { EspaciosFisicosApiService } from 'src/app/servicios/espacios_fisicos/espacios_fisicos_api.service';
import { EspacioFisico } from 'src/app/servicios/espacios_fisicos/interfaces/espacio_fisico.interface';
import { TipoAula } from 'src/app/servicios/tipos_aulas/interfaces/tipo_aula.interface';
import { TiposAulasApiService } from 'src/app/servicios/tipos_aulas/tipos-aulas-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-espacio-fisico',
  templateUrl: './crear-espacio-fisico.component.html',
  styleUrls: ['./crear-espacio-fisico.component.scss']
})
export class CrearEspacioFisicoComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly espaciosFisicosService: EspaciosFisicosApiService,
    private readonly router: Router,
    private readonly tipoAulasService: TiposAulasApiService,
  ) { }

  formGroup?: FormGroup;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  cargando: boolean = false;
  tipos: TipoAula[] = [];

  ngOnInit(): void {
    this.obtenerTipoEspacioFisico();
    this.configurarFormulario();
  }

  crearEspacioFisico() {
    if (this.formGroup) {
      if (this.formGroup.valid && !this.cargando) {
        Swal.showLoading();
        this.cargando = true;
        // Obtener valores
        const nuevoEspacioFisico: EspacioFisico = {
          nombre: this.formGroup.get('nombre')?.value,
          tipo_id: this.formGroup.get('tipo')?.value,
          aforo: Number(this.formGroup.get('aforo')?.value)
        };

        console.log("NUEVO ESPACIO FISICO", nuevoEspacioFisico)

        this.espaciosFisicosService.crearEspacioFisico(nuevoEspacioFisico)
          .subscribe({
            next: (res: any) => {
              Swal.fire(
                'Registro creado',
                `${res.mensaje}`,
                'success'
              ).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                  this.router.navigate(['/spa/espacios_fisicos']);
                }
              });
            },
            error: (res: any) => {
              Swal.fire(
                'Error',
                `${res.error.message}`,
                'error'
              );
              this.cargando = false;
            }
          });

      }
    }
  }

  obtenerTipoEspacioFisico() {
    this.tipoAulasService.obtenerTipoAulas().subscribe({
      next: (res) => {
        this.tipos = res as TipoAula[];
      }
    });
  }

  configurarFormulario() {
    this.formGroup = this.formBuilder.group({
      nombre: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ]
      ),
      tipo: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.pattern(`${this.tipos.map(s => `(^${s}$)`).join('|')}`),
        ]
      ),
      aforo: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.min(10),
          Validators.max(99),
          Validators.pattern('^[0-9]*$'),
        ]
      )
    });
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

}
