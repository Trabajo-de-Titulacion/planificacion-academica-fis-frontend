import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { RolesEnum } from "../enum/roles.enum";
import { UsuarioStorageService } from "../usuario-storage.service";

@Injectable()
export class EsGestorEspaciosFisicosGuard implements CanActivate{

    constructor(
        private readonly userService: UsuarioStorageService,
        private readonly router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const roles = this.userService.obtenerRoles();
        if (!roles) {
            return false;
        }
        if (!roles.includes(RolesEnum.GESTOR_ESPACIOS_FISICOS)) {
            this.router.navigate(['/spa']);
        }
        return roles.includes(RolesEnum.GESTOR_ESPACIOS_FISICOS);
    }

}