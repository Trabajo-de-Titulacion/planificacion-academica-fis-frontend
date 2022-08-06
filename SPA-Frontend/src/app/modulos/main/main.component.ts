import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/servicios/auth/models/usuario.model';
import { TokenStorageService } from 'src/app/servicios/auth/token-storage.service';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private readonly tokenService: TokenStorageService,
    private readonly usuarioService: UsuarioStorageService,
    private readonly router: Router,
  ) { }

  usuario?: Usuario;
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
    this.usuario = this.usuarioService.obtenerUsuario();
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

  esCoordinador() {
    return this.usuario!.roles.includes('COORDINADOR');
  }

  esDocente() {
    return this.usuario!.roles.includes('DOCENTE');
  }

  esSubdecano() {
    return this.usuario!.roles.includes('SUBDECANO');
  }

}
