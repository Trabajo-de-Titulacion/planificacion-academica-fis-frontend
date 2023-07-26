import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restriccion-lugar-tiempo',
  templateUrl: './restriccion-lugar-tiempo.component.html',
  styleUrls: ['./restriccion-lugar-tiempo.component.scss']
})
export class RestriccionLugarTiempoComponent implements OnInit {

  formularioRestriccionesLugarTiempo: FormGroup = new FormGroup({});

  idActividadRuta:string='';

  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarParametro();
    
  }

  cargarParametro(){
    this.route.params.subscribe(
      (params)=>{
        this.idActividadRuta = params['id'];
      }
    )

  }

}
