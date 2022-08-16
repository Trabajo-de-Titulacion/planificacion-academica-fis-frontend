import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from 'src/environments/environment';
import TipoAula from '../models/tipo-aula.interface';

@Injectable({
  providedIn: 'root'
})
export class TiposAulasApiService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  ruta = '/tipoAula';


  obtenerTipoAulas() : Observable<TipoAula[]> {
    const url = apiUrl + `${this.ruta}/obtenerTipoAulas`;
    return this.httpClient.get<TipoAula[]>(url);
  }
}
