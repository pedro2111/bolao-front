import { HttpClient } from '@angular/common/http';
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


}
