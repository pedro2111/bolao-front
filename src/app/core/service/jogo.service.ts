import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Jogo } from '../models/jogo.model';

@Injectable({
  providedIn: 'root'
})
export class JogoService {

  constructor(private http:HttpClient) { }

  public cadastrar(jogo:Jogo){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.post(`${environment.apiUrl}/jogos`, jogo, httpOptions);
  }

  public atualizar(jogo:Jogo){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.put(`${environment.apiUrl}/jogos/${jogo.id}`, jogo, httpOptions);
  }

  public listarPorData(campeonatoId:number,data:string){

    return this.http.get<Jogo[]>(`${environment.apiUrl}/jogos/listar-data?campeonato=${campeonatoId}&data=${data}`)

  }
  public listarPorRodada(campeonatoId:number,rodada:string){

    return this.http.get<Jogo[]>(`${environment.apiUrl}/jogos/listar-rodada?campeonato=${campeonatoId}&rodada=${rodada}`)

  }
  public listarRodadasCampeonato(campeonatoId:number){

    return this.http.get(`${environment.apiUrl}/jogos/listar-rodadas-campeonato?campeonato=${campeonatoId}`)

  }

  public listarRodadaAtual(campeonatoId:number){

    return this.http.get<string>(`${environment.apiUrl}/jogos/campeonato/${campeonatoId}/rodada-atual`, {responseType: 'text' as 'json'} )
  }


}
