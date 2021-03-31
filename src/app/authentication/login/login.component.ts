import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Usuario } from 'src/app/core/models/usuario.model';
import { LoginService } from 'src/app/core/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  error: boolean;
  submit = false;

  constructor(private loginService: LoginService, private router: Router) { }

  formulario: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'senha': new FormControl(null, [Validators.required])
  });

  ngOnInit() {
    localStorage.clear();

  }

  get f() {
    return this.formulario.controls;
  }
  login() {
    this.submit = true;

    if (this.formulario.invalid) {
      this.error = true;
      return;
      
    } else {
      let usuario: Usuario;
      usuario = this.formulario.getRawValue();
      this.loginService.login(usuario).subscribe((res) => {
        let token_decode = jwt_decode(res['token'])
        localStorage.setItem('nomeUsuario', token_decode['usuario']);
        localStorage.setItem('usuarioId', token_decode['usuario_id']);
        localStorage.setItem('token', res['token']);
        localStorage.setItem('usuario', usuario.email);
        this.error = false;
        this.router.navigate(['/dashboard/main']);

      }, (err) => {
        console.log(err);
        //console.log('validacao' + this.formulario.get('email').valid)
        this.error = true;
        if (err.status === 401) {
          this.router.navigate(['/authentication/login'])
        }
      }
      );
    }


  }



}
