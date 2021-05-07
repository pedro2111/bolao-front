import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BolaoParticipante } from '../models/bolaoParticipante.model';

@Injectable({
  providedIn: 'root'
})
export class BolaoParticipanteService {

  constructor(private http:HttpClient) { }

  public listarBolaoParticipantes(idBolao){

    return this.http.get<BolaoParticipante[]>(`${environment.apiUrl}/bolaoparticipantes/${idBolao}`)
  }

  public ativarToggle(idParticipante){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.put(`${environment.apiUrl}/bolaoparticipantes/ativar-toggle/participante/${idParticipante}`, httpOptions)
  }
}
