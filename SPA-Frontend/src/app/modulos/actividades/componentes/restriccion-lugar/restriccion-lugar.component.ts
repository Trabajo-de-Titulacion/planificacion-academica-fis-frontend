import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-restriccion-lugar',
  templateUrl: './restriccion-lugar.component.html',
  styleUrls: ['./restriccion-lugar.component.scss']
})
export class RestriccionLugarComponent implements OnInit {

  formularioRestriccionesLugar: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {
  }

}
