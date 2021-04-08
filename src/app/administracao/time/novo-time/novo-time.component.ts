import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from 'src/app/core/service/notification.service';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { FileInput } from 'ngx-material-file-input';
import { MatChipInputEvent } from '@angular/material/chips';
import { Time } from 'src/app/core/models/time.model';
import { startWith, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TimeService } from 'src/app/core/service/time.service';
import { Observable } from 'rxjs';

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
    });

    this.form1 = this.formBuilder.group({
      usuario_id: [this.criador],
      nome: ['', Validators.required]
    });
    this.form2 = this.formBuilder.group({
      imagem: ['', Validators.required]
    });
  }

  onFileSelect(event) {
    console.log('event imagem' + event)
    if (event.target.files.length > 0) {
      this.imagem = event.target.files[0],
        this.form2.get('imagem').setValue(event.target.files[0])
    }
  }

  cadastrar() {

  }
  uploadCapa() {

  }
  
  carregaForm(time: Time) {
    this.form1.patchValue({
      nome: time.nome
    });

  }

}
