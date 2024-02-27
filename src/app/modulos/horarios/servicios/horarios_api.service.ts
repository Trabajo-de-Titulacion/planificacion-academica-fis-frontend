import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';
import { HorarioDocente } from '../modelos/horarioDocente.interface';
import { HorarioGrupo } from '../modelos/horarioGrupo.interface';
import { HorarioAula } from '../modelos/horarioAula.interface';

@Injectable({
    providedIn: 'root'
})
export class HorarioApiService {

    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = '/horario';

    /* ======================================================================================= */
    /* =============================== OBTENER HORARIO DOCENTE =============================== */
    /* ======================================================================================= */

    obtenerHorarioDocente(nombreDocente: string, idHorario: string) {
        const url = apiUrl + `${this.ruta}/obtenerHorarioDocente/${nombreDocente}/${idHorario}`;
        return this.httpCliente.get<HorarioDocente[]>(url);
    }

    /* ======================================================================================= */
    /* =============================== OBTENER HORARIO GRUPO ================================= */
    /* ======================================================================================= */

    obtenerHorarioGrupo(grupo: string, idHorario: string) {
        const url = apiUrl + `${this.ruta}/obtenerHorarioGrupo/${grupo}/${idHorario}`;
        return this.httpCliente.get<HorarioGrupo[]>(url);
    }

    /* ======================================================================================= */
    /* =============================== OBTENER HORARIO AULA =============================== */
    /* ======================================================================================= */

    

    obtenerHorarioAula(nombreAula: string, idHorario: string) {

        nombreAula = encodeURIComponent(nombreAula); 

        const url = apiUrl + `${this.ruta}/obtenerHorarioAula/${nombreAula}/${idHorario}`;
        return this.httpCliente.get<HorarioAula[]>(url);
    }

    /* ======================================================================================= */
    /* ============================ OBTENER TODOS LOS HORARIOS =============================== */
    /* ======================================================================================= */

    obtenerHorarios() {
        const url = apiUrl + `${this.ruta}/obtenerHorarios`;
        return this.httpCliente.get(url);
    }

    /* =============================================================================== */
    /* ============================ OBTENER UN HORARIO =============================== */
    /* =============================================================================== */

    obtenerHorarioPorID(idHorario: string) {
        const url = apiUrl + `${this.ruta}/obtenerHorarioPorID/${idHorario}`;
        return this.httpCliente.get(url);
    }

    generarHorario(data : {
        email: string
    }){
        const url = apiUrl + `${this.ruta}/generarHorario`;
        return this.httpCliente.post(url, data);
    }

    cargarFET(archivo: File) {
        const url = apiUrl + `${this.ruta}/cargarFET`;

        const formData = new FormData();
        formData.append('archivoFet', archivo);

        return this.httpCliente.post(url, formData);
    }

}