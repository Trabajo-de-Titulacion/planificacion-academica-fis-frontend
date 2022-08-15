import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-docente',
  templateUrl: './crear-docente.component.html',
  styleUrls: ['./crear-docente.component.scss']
})
export class CrearDocenteComponent implements OnInit {

  constructor(
    private readonly router: Router
  ) { }

  ngOnInit(): void {

  }
}
