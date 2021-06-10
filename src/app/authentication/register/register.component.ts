import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FileInput } from 'ngx-material-file-input';
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
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private notificationService: NotificationService) { }

  formulario: FormGroup = new FormGroup({
    'nome': new FormControl(null, [Validators.required]),
    'email': new FormControl(null, [Validators.required]),
    'senha': new FormControl(null, [Validators.required])
  });
  form2:FormGroup;

  errors = [];
  erroNome: string;
  erroEmail: string;
  erroSenha: string;
  submit = false;
  imagem:File;
  formData = new FormData();
  usuario_id;
  showFormFoto = false;
  loading=false;

  ngOnInit() {
    this.form2 = this.fb.group({
      imagem: [null, Validators.required]
    });

  }
  onFileSelect(event) {
    //console.log('event imagem' + event)
    if (event.target.files.length > 0) {
      this.imagem = event.target.files[0],
        this.form2.get('imagem').setValue(event.target.files[0])
    }
  }
  uploadFoto() {
    if (this.form2.get('imagem').value != '') {
      this.loading = true;

      const file_form: FileInput = this.form2.get('imagem').value;

      //const file = file_form.files[0];
      const file = this.form2.get('imagem').value;

      this.formData.append('usuario_id', this.usuario_id)
      this.formData.append('imagem', file)
      this.formData.append('acao', 'cadastrar');
      

      this.loginService.uploadFoto(this.formData).subscribe(
        (res) => {
          this.notificationService.showNotification('snackbar-success', 'Foto adicionada com sucesso!', 'top', 'right')
          setTimeout(()=>{
            this.loading = false;
            this.router.navigate(['/authentication/login']);
            
          },2000)
        }, (err) => {
          this.loading = false;
          console.log(err)
        })
    }

  }

  get f() {
    return this.formulario.controls;
  }

  cadastrar() {

    if (this.formulario.invalid) {
      this.submit = true;
      return;

    } else {
      this.loading = true;
      let usuario: Usuario = this.formulario.getRawValue();

      this.loginService.cadastrar(usuario).subscribe((res) => {
        console.log('id usuaario = ' + res.id)
        this.usuario_id = res.id,
        this.notificationService.showNotification('snackbar-success', 'Parabéns! Você foi cadastrado com sucesso! Cadastre sua foto!', 'bottom', 'center');
        setTimeout(() => { this.showFormFoto = true ,this.loading = false; }, 3000)

      }, (err) => {
        this.loading = false;
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
