import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiUrl } from "src/environments/environment";
import { Actividad, ActividadEntity, CrearActividad } from "../modelos/actividad.interface";
import { ObtenerEspacioFisico } from "../modelos/espacios-fisicos.interface";

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
    
    //
    obtenerActividadporId(id:number){
        const url = apiUrl + `${this.ruta}/obtenerActividad/${id}`;
        return this.httpCliente.get<ActividadEntity>(url);
    }

    obtenerEspaciosFisicosPorTipoDeAula(id:string){
        const url =apiUrl + `/espacios_fisicos/obtenerEspaciosFisicoPorTipoDeAula/${id}`;
        return this.httpCliente.get<ObtenerEspacioFisico[]>(url);
    }

}