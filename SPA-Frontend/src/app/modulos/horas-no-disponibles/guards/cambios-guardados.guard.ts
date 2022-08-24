import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { ModificarHorasNoDisponiblesComponent } from "../componentes/modificar-horas-no-disponibles/modificar-horas-no-disponibles.component";

@Injectable()
export class CambiosGuardadosGuard implements CanDeactivate<ModificarHorasNoDisponiblesComponent>{

    constructor() {}
    canDeactivate(
        component: ModificarHorasNoDisponiblesComponent, currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot | undefined
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // Si el botón de guardado no está habilitado es porque no hay cambios sin guardar
        if (!component.btnGuardarHabilitado) {
            return true;
        }
        
        // Si hay cambios, pregunta por si desea guardarlos
        return new Promise(resolve => {
            Swal.fire({
                title: 'Hay cambios sin guardar',
                text: `¿Desea guardar sus cambios antes de salir?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Guardar cambios',
                cancelButtonText: 'Salir',
            })
            .then((result) => {
                // Guardar cambios
                if (result.isConfirmed) {
                    component.guardarCambios();
                    resolve(false);
                }
                // Salir del componente
                if (result.isDenied) {
                    resolve(true);
                }
                // Se cierra el mensaje emergente
                resolve(false);
            });
        });   
    }    

}