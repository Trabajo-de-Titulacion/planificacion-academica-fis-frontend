import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { apiUrl } from "src/environments/environment";
import JornadaLaboral from "../models/jornada-laboral.interface";


@Injectable({
    providedIn: 'root'
})
export class JornadaLaboralService {

    private readonly ruta = '/jornadaLaboral';
    private readonly jornadaLaboralURL = `${apiUrl}${this.ruta}`;

    constructor(
        private readonly httpClient: HttpClient,
    ) { }

    obtenerJornadaLaboralPorSemestre(idSemestre: string): Observable<JornadaLaboral[]>{
        return this.httpClient.get<JornadaLaboral[]>(`${this.jornadaLaboralURL}/obtenerJornadaLaboralPorSemestre/${idSemestre}`)
    }

    crearJornadaLaboral(jornada : JornadaLaboral){
        return this.httpClient.post(`${this.jornadaLaboralURL}/crearJornadaLaboral`, jornada);
    }
}