import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import JornadaLaboral from '../../models/jornada-laboral.interface';
import Semestre from '../../models/semestre.interface';
import { JornadaLaboralService } from '../../services/jornada-laboral.service';

@Component({
  selector: 'app-jornada-laboral',
  templateUrl: './jornada-laboral.component.html',
  styleUrls: ['./jornada-laboral.component.scss', '../../styles/common.scss']
})
export class JornadaLaboralComponent implements OnInit {

  @Input() semestre? : Semestre;

  formularioJornadaLaboral : FormGroup = new FormGroup({});
  jornadaLaboral? : JornadaLaboral

  diasLaborables: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  inputType = 'number';
  disabled = false;


  constructor(
    private servicioJornadaLaboral : JornadaLaboralService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    if(this.semestre?.id){
      this.servicioJornadaLaboral.obtenerJornadaLaboralPorSemestre(this.semestre?.id).subscribe(
        data => {
          console.log('data', data);
        }
      )
    }
  }

  private crearFormulario(){
    this.formularioJornadaLaboral = this.fb.group({
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]],
      horaAlmuerzo: ['', Validators.required],
      dias: [[], Validators.required],
    });
  }

  sendData(form : FormGroup){
    console.log(form.value)
    console.log(this.formularioJornadaLaboral.value)
  }

}
