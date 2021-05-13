import { HttpClient } from '@angular/common/http';
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

  listarPalpitesUsuarioBolao(bolaoId,usuarioId){

    return this.http.get<Palpite[]>(`${environment.apiUrl}/palpites/listarPalpitesUsuarioBolao?bolao=${bolaoId}&usuario=${usuarioId}`)
  }
}
