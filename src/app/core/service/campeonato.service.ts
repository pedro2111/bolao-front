import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Campeonato } from '../models/campeonato.model';
import { Time } from '../models/time.model';

@Injectable({
  providedIn: 'root'
})
export class CampeonatoService {

  constructor(private http:HttpClient) { }

  public listarTodosCampeonatos(){

    return this.http.get<Campeonato[]>(`${environment.apiUrl}/campeonatos/listar-todos-campeonatos`);
  }
  public listarCampeonatoById(id){

    return this.http.get<Campeonato>(`${environment.apiUrl}/campeonatos/${id}`);
  }

  public listarCampeonatos (page,size){

     return this.http.get<Campeonato>(`${environment.apiUrl}/campeonatos/listar-campeonatos?page=${page}&size=${size}`);

  }

  public uploadCapaCampeonato(formData:FormData){

    return this.http.put(`${environment.apiUrl}/campeonatos/upload-imagem`, formData);

  }

  public cadastrar(campeonato:Campeonato){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.post(`${environment.apiUrl}/campeonatos`, campeonato, httpOptions)

  }
  public cadastrarTimes(campeonato:Campeonato){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.post(`${environment.apiUrl}/campeonatos/times`, campeonato, httpOptions)

  }

  public atualizar (campeonato_id, campeonato:Campeonato){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }
    
    return this.http.put(`${environment.apiUrl}/campeonatos/${campeonato_id}`, campeonato, httpOptions);
  }
 
}
