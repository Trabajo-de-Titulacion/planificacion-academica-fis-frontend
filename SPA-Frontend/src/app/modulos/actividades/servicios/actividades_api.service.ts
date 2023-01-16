import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiUrl } from "src/environments/environment";
import { Actividad, CrearActividad } from "../modelos/actividad.interface";

@Injectable({
    providedIn: 'root'
})
export class ActividadesApiService {

    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = "/actividades";

    crearUnaActividad(actividad: CrearActividad) {
        const url = apiUrl + `${this.ruta}/crearUnaActividad`;
        return this.httpCliente.post(url, actividad);
    }

    obtenerActividades() {
        const url = apiUrl + `${this.ruta}/obtenerActividades`;
        return this.httpCliente.get(url);
    }

}