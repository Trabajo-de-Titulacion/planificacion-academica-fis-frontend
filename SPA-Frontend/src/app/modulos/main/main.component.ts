import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/servicios/auth/token-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private readonly tokenService: TokenStorageService,
    private readonly router: Router,
  ) { }

  usuario = "usuario@epn.edu.ec";
  mostrarMenuAcciones: boolean = true;
  sesionIniciada: boolean = false;

  ngOnInit(): void {
    this.sesionIniciada = !!this.tokenService.obtenerToken();
    // Si no ha iniciado sesión
    if (!this.sesionIniciada) {
      const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
      })
      
      this.router.navigate(['/login']);
  
      toast.fire({
        icon: 'error',
        title: '¡Acceso denegado!'
      });
      return;
    }
  }

  cerrarSesion() {
    this.tokenService.cerrarSesion();

    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
    })
    
    this.router.navigate(['/login']);

    toast.fire({
      icon: 'info',
      title: 'Hasta luego'
    });
  }

  toogleMenuAcciones() {
    this.mostrarMenuAcciones = !this.mostrarMenuAcciones;
  }

}
