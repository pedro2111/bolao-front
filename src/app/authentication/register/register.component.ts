import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/core/models/usuario.model';
import { LoginService } from 'src/app/core/service/login.service';
import { NotificationService } from 'src/app/core/service/notification.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private notificationService: NotificationService) { }

  formulario: FormGroup = new FormGroup({
    'nome': new FormControl(null, [Validators.required]),
    'email': new FormControl(null, [Validators.required]),
    'senha': new FormControl(null, [Validators.required])
  });

  errors = [];
  erroNome: string;
  erroEmail: string;
  erroSenha: string;
  submit = false;

  ngOnInit() {
  }

  get f() {
    return this.formulario.controls;
  }

  cadastrar() {

    if (this.formulario.invalid) {
      this.submit = true;
      return;

    } else {
      let usuario: Usuario = this.formulario.getRawValue();

      this.loginService.cadastrar(usuario).subscribe((res) => {

        this.notificationService.showNotification('snackbar-success', 'Parabéns! Você foi cadastrado com sucesso! siga para o login.', 'bottom', 'center');
        setTimeout(() => { this.router.navigate(['/authentication/login']) }, 3000)

      }, (err) => {
        this.erroNome = '';
        this.erroEmail = '';
        this.erroSenha = '';
        this.errors = err['error'];
        this.errors.forEach((e) => {
          if (e['campo'] == 'nome') {
            this.erroNome = e['campo'] + ' ' + e['erro'];
          }
          if (e['campo'] == 'email') {
            this.erroEmail = e['campo'] + ' ' + e['erro'];
          }
          if (e['campo'] == 'senha') {
            this.erroSenha = e['campo'] + ' ' + e['erro'];
          }
        }
        );
      }
      );
    }
  }

}
