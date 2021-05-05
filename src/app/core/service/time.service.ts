import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Time } from '../models/time.model';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor(private http:HttpClient) { }

  public listarTimes (nomeTime?:String){
    
    if(nomeTime == null){
      return this.http.get<Time[]>(`${environment.apiUrl}/times/listarTodosTimes`);

    }else{
      return this.http.get<Time[]>(`${environment.apiUrl}/times/listarTodosTimes?nome=${nomeTime}` );

    }
    
  }

  public listarTimeById(id){

    return this.http.get(`${environment.apiUrl}/times/${id}`);
  }

  public cadastrar (time:Time){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.post(`${environment.apiUrl}/times`, time, httpOptions);

  }
  public uploadCapaTime(formData:FormData){

    return this.http.put(`${environment.apiUrl}/times/upload-imagem`, formData);

  }

  public atualizar (id, time:Time){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers: headers
    }

    return this.http.put(`${environment.apiUrl}/times/${id}`, time, httpOptions);

  }
}
