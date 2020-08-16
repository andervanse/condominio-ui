import { Injectable } from '@angular/core';
import { Negocio } from '../models/negocio.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class NegocioService {

  negocio: Negocio;
  negocios: Negocio[] = [];

  constructor(
      private http: HttpClient) { }  

  novaPostagem(usuarioId: number) :Negocio {
      let negocio = new Negocio();
      negocio.id = null;
      negocio.usuarioId = usuarioId;
      negocio.ordem = null;
      negocio.urlImagem = null;
      return negocio;
  }    

  obterNegocio(NegocioId: number): Observable<Negocio> {
      if (isNullOrUndefined(this.negocio) || this.negocio.id !== NegocioId) {
          return this.http.get<Negocio>(`${environment.apiBaseUrl}/api/negocios/${NegocioId}`)
              .pipe(
                  map((resp) => {
                      this.negocio = resp[0];
                      return this.negocio;
                  })
              );

      } else {
          return of(this.negocio);
      }
  }

  obterNegocios(): Observable<Negocio[]> {
      return this.http.get<Negocio[]>(`${environment.apiBaseUrl}/api/negocios`)
          .pipe(
              map((resp) => {
                  this.negocios = resp.sort((a, b) => {
                      if (a.ordem > b.ordem) {
                        return 1;
                      } else if (a.ordem < b.ordem) {
                          return -1;
                      } else {
                          return 0;
                      }
                  } );

                  return this.negocios;
              })
          );
  }
  
  salvarNegocio(Negocio: Negocio): Observable<any> {
      return this.http.post(`${environment.apiBaseUrl}/api/negocios`, Negocio)
          .pipe(
              map((resp) => {
                  this.negocios.push(Negocio);
                  return this.negocios;
              })
          );
  }

  excluirNegocio(NegocioId: number): Observable<any> {
      this.negocio = null;
      return this.http.delete(`${environment.apiBaseUrl}/api/negocios/${NegocioId}`)
          .pipe(
              map((resp) => {
                  let idx = this.negocios.findIndex(a => { return a.id == NegocioId });
                  this.negocios.splice(idx, 1);
                  return this.negocios;
              })
          );
  }

  deleteImagem(keyName: string): Observable<any> {
      return this.http.delete<any>(`${environment.apiBaseUrl}/api/uploadFile/${keyName}`)
        .pipe(
          map((resp) => {
            return resp;
          })
        );
  } 

  uploadImagem(file: any): Observable<any> {
      return this.http.post<any>(`${environment.apiBaseUrl}/api/uploadFile`, file)
        .pipe(
          map((resp) => {
            return resp;
          })
        );
  }
}
