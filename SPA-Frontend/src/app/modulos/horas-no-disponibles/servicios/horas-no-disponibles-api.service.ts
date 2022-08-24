import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/environments/environment';
import { HoraNoDisponible } from '../modelos/hora_no_disponible.interface';

@Injectable({
  providedIn: 'root'
})
export class HorasNoDisponiblesApiService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  ruta = '/horas_no_disponibles';

  obtenerHorasNoDisponiblesPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/obtenerHorasNoDisponiblesPorDocente/${id}`;
    return this.httpClient.get<HoraNoDisponible[]>(url);
  }

  crearHorasNoDisponibles(horas_no_disponibles: HoraNoDisponible[]) {
    const url = apiUrl + `${this.ruta}/crearHorasNoDisponibles`;
    return this.httpClient.post(url, horas_no_disponibles);
  }

  eliminarHorasNoDisponiblesPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/eliminarHoras/${id}`;
    return this.httpClient.delete(url);
  }
}
