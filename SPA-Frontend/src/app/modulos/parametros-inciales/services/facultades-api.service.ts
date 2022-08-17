import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from 'src/environments/environment';
import { Facultad } from '../models/facultad.interface';

@Injectable({
  providedIn: 'root'
})
export class FacultadesApiService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  ruta = '/facultades';

  obtenerFacultades() : Observable<Facultad[]> {
    const url = apiUrl + `${this.ruta}/obtenerFacultades`;
    return this.httpClient.get<Facultad[]>(url);
  }
}
