import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileInput } from 'ngx-material-file-input';
import { Campeonato } from 'src/app/core/models/campeonato.model';
import { CampeonatoService } from 'src/app/core/service/campeonato.service';
import { NotificationService } from 'src/app/core/service/notification.service';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Time } from 'src/app/core/models/time.model';
import { startWith, switchMap, tap,debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { TimeService } from 'src/app/core/service/time.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-novo-campeonato',
  templateUrl: './novo-campeonato.component.html',
  styleUrls: ['./novo-campeonato.component.sass']
})
export class NovoCampeonatoComponent implements OnInit {

  isLinear = false;
  form1: FormGroup;
  form2: FormGroup;
  criador = localStorage.getItem('usuarioId');
  formData = new FormData();
  imagem: File;
  campeonato_id;
  campeonatoEditId;
  //TIPS
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  timeControl = new FormControl();
  times: Time[];
  timesFiltered:Observable<any>;
  timesAdicionados: String[] = [];
  timesIds:Number[] = [];

  @ViewChild('timeInput', { static: true }) timeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

  constructor(
    private formBuilder: FormBuilder,
    private campeonatoService: CampeonatoService,
    private timeSevice: TimeService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {


    this.route.paramMap.subscribe((param) => {
      this.campeonatoEditId = param.get('id');

      if (param.get('id') != undefined) {
        this.listarCampeonatoById(this.campeonatoEditId);
      }

    });

    this.form1 = this.formBuilder.group({
      criador_id: [this.criador],
      nome: ['', Validators.required]
    });
    this.form2 = this.formBuilder.group({
      imagem: ['', Validators.required]
    });

    this.timesFiltered = this.timeControl.valueChanges.pipe(
      startWith(null),
      debounceTime(1000), 
      distinctUntilChanged(),
      switchMap(filtro => this.timeSevice.listarTimes(filtro))
      );

  }

  onFileSelect(event) {
    console.log('event imagem' + event)
    if (event.target.files.length > 0) {
      this.imagem = event.target.files[0],
        this.form2.get('imagem').setValue(event.target.files[0])
    }
  }

  cadastrar() {

    let campeonato = this.form1.getRawValue();

    if (this.campeonatoEditId == undefined) {
      this.campeonatoService.cadastrar(campeonato).subscribe(
        (res: Campeonato) => {
          this.campeonato_id = res.id,
            this.notificationService.showNotification('snackbar-success', 'Campeonato cadastrado com sucesso', 'top', 'right')

        }, (err) => {
          console.log(err)
        })

    } else {
      this.campeonatoService.atualizar(this.campeonatoEditId, campeonato).subscribe(
        (res) => {
          this.campeonato_id = this.campeonatoEditId,
            this.notificationService.showNotification('snackbar-success', 'Campeonato atualizado com sucesso', 'top', 'right')
        }, (err) => {
          console.log(err)
        });

    }

  }

  uploadCapa() {
    if (this.form2.get('imagem').value != '') {

      const file_form: FileInput = this.form2.get('imagem').value;

      const file = file_form.files[0];

      this.formData.append('campeonato_id', this.campeonato_id)
      this.formData.append('imagem', file)
      if (this.campeonatoEditId == undefined) {
        this.formData.append('acao', 'cadastrar');
      } else {
        this.formData.append('acao', 'editar');
      }

      this.campeonatoService.uploadCapaCampeonato(this.formData).subscribe(
        (res) => {
          this.notificationService.showNotification('snackbar-success', 'Imagem adicionada com sucesso!', 'top', 'right')

        }, (err) => {
          console.log(err)
        })
    }

  }

  cadastrarTimes(){
    
    let campeonato:Campeonato = new Campeonato();

    if (this.campeonatoEditId == undefined) {
      campeonato.id = this.campeonato_id;
    } else {
      campeonato.id = this.campeonatoEditId;
    }    
    
    campeonato.times_id = this.timesIds;

    this.campeonatoService.cadastrarTimes(campeonato).subscribe(
      (res) => {
        this.notificationService.showNotification('snackbar-success', 'Times adcionados com sucesso', 'top', 'right');
        setTimeout(()=>{
          this.router.navigate(['/administracao/campeonato']);
        },2000)
        
      },(err) => {
        console.log(err)
      });
    
  }

  public listarCampeonatoById(id) {
    this.campeonatoService.listarCampeonatoById(this.campeonatoEditId).subscribe(
      (res) => {
        this.carregaForm(res)
      }, (err) => {
        console.log(err)
      });

  }
  public carregaForm(campeonato: Campeonato) {
    this.form1.patchValue({
      nome: campeonato.nome
    });
    campeonato.times.forEach(time => {
      this.timesAdicionados.push(time.nome),
      this.timesIds.push(time.id)
    })

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    
    if ((value || '').trim()) {
      this.timesAdicionados.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.timeControl.setValue(null);
  }

  remove(time: String) {
    const index = this.timesAdicionados.indexOf(time);
    
    if (index >= 0) {
      this.timesAdicionados.splice(index, 1);
      this.timesIds.splice(index,1);
      
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
  
    this.timesIds.push(event.option.value);
    this.timesAdicionados.push(event.option.viewValue);
    this.timeInput.nativeElement.value = '';
    this.timeControl.setValue(null);

  }
  



}
