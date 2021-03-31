import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  public listarUsuarioById(id) {

    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/${id}`);

  }
}
