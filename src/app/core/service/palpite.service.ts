import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Palpite } from '../models/palpite.model';

@Injectable({
  providedIn: 'root'
})
export class PalpiteService {
  
  

  constructor(
    private http:HttpClient
  ) { }

  public listarPalpitesUsuarioBolao(bolaoId,usuarioId,rodada){

    if(rodada == ''){
      
      return this.http.get<Palpite[]>(`${environment.apiUrl}/palpites/listarPalpitesUsuarioBolao?bolao=${bolaoId}&usuario=${usuarioId}`)
    }else{
      
      return this.http.get<Palpite[]>(`${environment.apiUrl}/palpites/listarPalpitesUsuarioBolao?bolao=${bolaoId}&usuario=${usuarioId}&rodada=${rodada}`)
    }
    
  }
  public listarPalpitesUsuarioBolaoData(bolaoId: any, usuarioId: any, data: any) {
    if(data == ''){
      
      return this.http.get<Palpite[]>(`${environment.apiUrl}/palpites/listarPalpitesUsuarioBolao?bolao=${bolaoId}&usuario=${usuarioId}`)
    }else{
      
      return this.http.get<Palpite[]>(`${environment.apiUrl}/palpites/listarPalpitesUsuarioBolao?bolao=${bolaoId}&usuario=${usuarioId}&dtJogo=${data}`)
    }
    
  }

  public cadastrar(palpite){
    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.post(`${environment.apiUrl}/palpites`, palpite, httpOptions)
  }
  
  public atualizar(palpite){
    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.put(`${environment.apiUrl}/palpites`, palpite, httpOptions)
  }
  
}
