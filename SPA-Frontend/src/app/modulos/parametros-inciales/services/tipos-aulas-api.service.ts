import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiposAulasApiService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  ruta = '/tipoAula';


  obtenerTipoAulas() {
    const url = apiUrl + `${this.ruta}/obtenerTipoAulas`;
    return this.httpClient.get(url);
  }
}
