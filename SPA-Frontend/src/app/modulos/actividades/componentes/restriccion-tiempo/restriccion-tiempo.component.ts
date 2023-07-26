import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-restriccion-tiempo',
  templateUrl: './restriccion-tiempo.component.html',
  styleUrls: ['./restriccion-tiempo.component.scss']
})
export class RestriccionTiempoComponent implements OnInit {

  formularioRestriccionesTiempo: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {
  }

}
