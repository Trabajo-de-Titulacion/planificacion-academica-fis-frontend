import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacultadesApiService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  ruta = '/facultades';

  obtenerFacultades() {
    const url = apiUrl + `${this.ruta}/obtenerFacultades`;
    return this.httpClient.get(url);
  }
}
