import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/environments/environment';
import { HoraNoDisponible } from '../modelos/hora_no_disponible.interface';
import { SolicitudHoraNoDisponible } from '../modelos/solicitudHoraNoDisponible.interface';

@Injectable({
  providedIn: 'root'
})
export class HorasNoDisponiblesApiService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  ruta = '/horas_no_disponibles';

  solicitarHorasNoDisponibles(idDocente: string, horas_no_disponibles: HoraNoDisponible[]) {
    const url = apiUrl + `${this.ruta}/solicitarHorasNoDisponibles/${idDocente}`;
    return this.httpClient.post(url, horas_no_disponibles);
  }

  obtenerHorasNoDisponiblesSolicitadasPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/obtenerHorasNoDisponiblesSolicitadasPorDocenteId/${id}`;
    return this.httpClient.get<HoraNoDisponible[]>(url);
  }

  obtenerSolicitudesDelSemestreEnProgreso() {
    const url = apiUrl + `${this.ruta}/obtenerSolicitudesDelSemestreEnProgreso`;
    return this.httpClient.get<SolicitudHoraNoDisponible[]>(url);
  }

  eliminarHorasNoDisponiblesPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/eliminarHoras/${id}`;
    return this.httpClient.delete(url);
  }

  aprobarSolicitudHorasNoDisponiblesPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/aprobarSolicitudHorasNoDisponiblesPorDocenteId/${id}`;
    return this.httpClient.get(url);
  }

  rechazarSolicitudHorasNoDisponiblesPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/rechazarSolicitudHorasNoDisponiblesPorDocenteId/${id}`;
    return this.httpClient.get(url);
  }
}
