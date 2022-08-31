import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GrupoApiService {

    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = '/grupo'

    /* ============================================================================== */
    /* =============================== OBTENER GRUPOS =============================== */
    /* ============================================================================== */

    obtenerGrupos() {
        const url = apiUrl + `${this.ruta}/obtenerTodosLosGrupos`;
        return this.httpCliente.get(url);
    }

}