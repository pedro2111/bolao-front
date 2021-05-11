import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(usuario:Usuario){

    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers:headers
    }

    return this.http.post(`${environment.apiUrl}/auth`, usuario,httpOptions);
  }

  cadastrar(usuario:Usuario){
    let headers: HttpHeaders = new HttpHeaders()
    headers.append('Content-type', 'application/json');

    const httpOptions = {
      headers:headers
    }

    return this.http.post<Usuario>(`${environment.apiUrl}/usuarios`, usuario, httpOptions);

  }

  uploadFoto(formData:FormData){

    return this.http.put(`${environment.apiUrl}/usuarios/upload-imagem`,formData)
  } 
  

}
