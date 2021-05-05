import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bolao } from '../models/bolao.model';

@Injectable({
  providedIn: 'root'
})
export class BolaoService {

  constructor(private http:HttpClient) { }

  public listarBoloes(page,size,pesquisa){

    if(pesquisa != ''){
      
      return this.http.get<Bolao>(`${environment.apiUrl}/boloes?page=${page}&size=${size}&nomeBolao=${pesquisa}`);

    }else{
      return this.http.get<Bolao>(`${environment.apiUrl}/boloes?page=${page}&size=${size}`);

    }
    
  }
  public listarAllBoloes(){

      return this.http.get<Bolao[]>(`${environment.apiUrl}/boloes/listar-sem-paginacao`);

  }
  public listarBolaoById(id){

      return this.http.get<Bolao>(`${environment.apiUrl}/boloes/${id}`);

  }

  public uploadCapaBolao(formData:FormData){

    return this.http.put(`${environment.apiUrl}/boloes/upload-imagem`, formData);

  }

  public cadastrar(bolao:Bolao){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.post(`${environment.apiUrl}/boloes`, bolao, httpOptions)

  }
  public atualizar (id, bolao:Bolao){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.put(`${environment.apiUrl}/boloes/${id}`, bolao, httpOptions);

  }


}
