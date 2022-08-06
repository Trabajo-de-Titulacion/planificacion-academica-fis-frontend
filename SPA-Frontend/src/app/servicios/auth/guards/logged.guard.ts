import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { TokenStorageService } from "../token-storage.service";

@Injectable()
export class LoggedGuard implements CanActivate{

    constructor(
        private readonly tokenService: TokenStorageService,
        private readonly router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const sesionIniciada = !!this.tokenService.obtenerToken();

        if (!sesionIniciada) {
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
        }
        return sesionIniciada;
    }

}