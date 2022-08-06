import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UsuarioStorageService } from "../usuario-storage.service";

@Injectable()
export class EsDocenteGuard implements CanActivate{

    constructor(
        private readonly userService: UsuarioStorageService,
        private readonly router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const roles = this.userService.obtenerRoles();
        if (!roles.includes("DOCENTE")) {
            this.router.navigate(['/spa']);
        }
        return roles.includes("DOCENTE");
    }

}