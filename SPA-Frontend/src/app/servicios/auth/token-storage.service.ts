import { Injectable } from '@angular/core';
import { TOKEN_KEY } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  guardarToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  obtenerToken() {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  cerrarSesion() {
    window.sessionStorage.clear();
  }

}
