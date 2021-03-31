import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Time } from '../models/time.model';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor(private http:HttpClient) { }

  public listarTimes (nomeTime:String){
    
    if(nomeTime == null){
      return this.http.get<Time>(`${environment.apiUrl}/times/listarTodosTimes` );
    }else{

    }
    return this.http.get<Time>(`${environment.apiUrl}/times/listarTodosTimes?nome=${nomeTime}` );
  }
}
