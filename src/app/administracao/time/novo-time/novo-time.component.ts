import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from 'src/app/core/service/notification.service';

import { FileInput } from 'ngx-material-file-input';
import { Time } from 'src/app/core/models/time.model';
import { TimeService } from 'src/app/core/service/time.service';

@Component({
  selector: 'app-novo-time',
  templateUrl: './novo-time.component.html',
  styleUrls: ['./novo-time.component.sass']
})
export class NovoTimeComponent implements OnInit {

  isLinear = false;
  form1: FormGroup;
  form2: FormGroup;
  criador = localStorage.getItem('usuarioId');
  formData = new FormData();
  imagem: File;
  time_id;
  timeEditId;

  constructor(
    private formBuilder: FormBuilder,
    private timeSevice: TimeService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((param) => {
      this.timeEditId = param.get('id');

      if (param.get('id') != undefined) {
        this.timeSevice.listarTimeById(this.timeEditId).subscribe(
          (res: Time) => {
            this.carregaForm(res)

          }, (err) => {
            console.log(err)
          }
        )
      }
    });

    this.initForms();
  }

  onFileSelect(event) {
    console.log('event imagem' + event)
    if (event.target.files.length > 0) {
      this.imagem = event.target.files[0],
        this.form2.get('imagem').setValue(event.target.files[0])
    }
  }

  cadastrar() {

    let time: Time = this.form1.getRawValue();


    if (this.timeEditId == undefined) {
      this.timeSevice.cadastrar(time).subscribe(
        (res: Time) => {
          this.time_id = res.id,
          this.notificationService.showNotification('snackbar-success', 'Time cadastrado com sucesso!', 'top', 'right');

        }, (err) => {
          console.log(err)
        });
    
      } else {
      this.timeSevice.atualizar(this.timeEditId, time).subscribe(
        (res) => {
          this.time_id = this.timeEditId,
          this.notificationService.showNotification('snackbar-success', 'Time atualizado com sucesso!', 'top', 'right')
        
        }, (err) => {
          console.log(err)
        });
    }

  }
  uploadCapa() {
    if (this.form2.get('imagem').value != '') {

      const file_form: FileInput = this.form2.get('imagem').value;

      const file = file_form.files[0];

      this.formData.append('time_id', this.time_id)
      this.formData.append('imagem', file)
      if (this.timeEditId == undefined) {
        this.formData.append('acao', 'cadastrar');
      } else {
        this.formData.append('acao', 'editar');
      }

      this.timeSevice.uploadCapaTime(this.formData).subscribe(
        (res) => {
          this.notificationService.showNotification('snackbar-success', 'Imagem adicionada com sucesso!', 'top', 'right')
          setTimeout(()=>{
            this.router.navigate(['/administracao/time']);
          },2000)
        }, (err) => {
          console.log(err)
        })
    }

  }

  carregaForm(time: Time) {
    this.form1.patchValue({
      nome: time.nome,
      url: time.url
    });

  }
  
  reset(){
    this.form1.reset();
    this.form2.reset();
    this.initForms();

  }
  initForms(){
    this.form1 = this.formBuilder.group({
      usuario_id: [this.criador],
      nome: ['', Validators.required],
      url: [''],
      public_id: ['']
    });
    this.form2 = this.formBuilder.group({
      imagem: ['', Validators.required]
    });

  }

}
