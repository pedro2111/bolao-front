import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BolaoCriterio } from '../models/bolaoCriterio.model';

@Injectable({
  providedIn: 'root'
})
export class BolaoCriterioService {

  constructor(private http:HttpClient) { }

  public listarCriteriosBolao(bolaoId){

    return this.http.get<BolaoCriterio[]>(`${environment.apiUrl}/boloes-criterios?bolao=${bolaoId}`);

  }

  public cadastrar(bolaoCriterio:BolaoCriterio){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.post(`${environment.apiUrl}/boloes-criterios`, bolaoCriterio, httpOptions)

  }


}
