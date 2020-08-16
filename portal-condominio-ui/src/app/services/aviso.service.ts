import { Injectable } from '@angular/core';
import { Aviso } from '../models/aviso.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class AvisoService {

  aviso: Aviso;
  avisos: Aviso[] = [];

  constructor(
      private http: HttpClient) { }  

  novaPostagem(usuarioId: number) :Aviso {
      let aviso = new Aviso();
      aviso.id = null;
      aviso.usuarioId = usuarioId;
      aviso.ordem = null;
      aviso.urlImagem = null;
      return aviso;
  }    

  obterAviso(avisoId: number): Observable<Aviso> {
      if (isNullOrUndefined(this.aviso) || this.aviso.id !== avisoId) {
          return this.http.get<Aviso>(`${environment.apiBaseUrl}/api/home/notificacoes/${avisoId}`)
              .pipe(
                  map((resp) => {
                      this.aviso = resp[0];
                      return this.aviso;
                  })
              );

      } else {
          return of(this.aviso);
      }
  }

  obterAvisos(): Observable<Aviso[]> {
      return this.http.get<Aviso[]>(`${environment.apiBaseUrl}/api/home/notificacoes`)
          .pipe(
              map((resp) => {
                  this.avisos = resp.sort((a, b) => {
                      if (a.ordem > b.ordem) {
                        return 1;
                      } else if (a.ordem < b.ordem) {
                          return -1;
                      } else {
                          return 0;
                      }
                  } );

                  return this.avisos;
              })
          );
  }
  
  salvarAviso(aviso: Aviso): Observable<any> {
      return this.http.post(`${environment.apiBaseUrl}/api/home/notificacoes`, aviso)
          .pipe(
              map((resp) => {
                  this.avisos.push(aviso);
                  return this.avisos;
              })
          );
  }

  excluirAviso(avisoId: number): Observable<any> {
      this.aviso = null;
      return this.http.delete(`${environment.apiBaseUrl}/api/home/notificacoes/${avisoId}`)
          .pipe(
              map((resp) => {
                  let idx = this.avisos.findIndex(a => { return a.id == avisoId });
                  this.avisos.splice(idx, 1);
                  return this.avisos;
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
