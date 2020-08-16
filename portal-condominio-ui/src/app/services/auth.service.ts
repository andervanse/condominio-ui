import { Injectable, EventEmitter } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from "@angular/common/http";
import { isNullOrUndefined, isUndefined } from 'util';
import { LoginCredentials } from '../models/login-credentials.model';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

  usuario: Usuario = null;

  constructor(private http: HttpClient) { }

  onAuthenticating: EventEmitter<boolean> = new EventEmitter();

  obterUsuario(): Usuario {
    let usuario = JSON.parse(localStorage.getItem('currentUser'));

    if (isNullOrUndefined(usuario)) {
      return null;
    } else {
      return usuario['usuario'];
    }
  }

  autenticar(credentials: LoginCredentials): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.apiBaseUrl}/api/auth`, credentials)
      .pipe(
        map((resp) => {
          localStorage.setItem('currentUser', JSON.stringify(resp));
          let user = new Usuario();
          return user;
        })
      );
  }

  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };

  public isAuthenticated(): boolean {
    let currentUser = localStorage.getItem('currentUser');

    if (isNullOrUndefined(currentUser))
      return false;

    const token = JSON.parse(currentUser)['token'];

    if (token !== null) {
      let decodedToken = this.parseJwt(token);

      if (decodedToken.exp < Date.now() / 1000) {
        localStorage.clear();
        return false;
      }
    }

    return token !== null && !isUndefined(token);
  }

  public isAdmin(): boolean {
    let user = this.obterUsuario();
    return this.isAuthenticated() && user.administrador;
  }

  public logout() {
    localStorage.clear();
  }
}
