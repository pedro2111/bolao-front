import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JogoService } from 'src/app/core/service/jogo.service';
import * as moment from 'moment';
import { Jogo } from 'src/app/core/models/jogo.model';
import { NotificationService } from 'src/app/core/service/notification.service';
import { CampeonatoService } from 'src/app/core/service/campeonato.service';
import { TimeService } from 'src/app/core/service/time.service';


@Component({
  selector: 'app-novo-jogo',
  templateUrl: './novo-jogo.component.html',
  styleUrls: ['./novo-jogo.component.sass']
})
export class NovoJogoComponent implements OnInit {

  form: FormGroup;
  criador_id = localStorage.getItem('usuarioId');
  times;
  campeonatos;
  loadingTime = false;

  constructor(
    private fb: FormBuilder,
    private jogoService: JogoService,
    private campeonatoService:CampeonatoService,
    private timeService:TimeService,
    private notificationService: NotificationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.listarCampeonatos();

    this.form.controls['campeonato_id'].valueChanges.subscribe((campId) => {
      if(campId != null){
        this.loadingTime = true;
        this.listarCampeonatosById(campId);
        setTimeout(() => {
          this.loadingTime = false;
        }, 1000);
      }

    },(err) => {
      console.log(err)
    },()=>{
      this.loadingTime = false;
    })
  }

  initForm() {
    this.form = this.fb.group({
      time1_id: ['', [Validators.required]],
      time2_id: ['', [Validators.required]],
      campeonato_id: ['', [Validators.required]],
      criador_id: [this.criador_id],
      dtJogo: ['', [Validators.required]],
      local: ['', [Validators.required]],
      rodada: ['', [Validators.required]]
    });
  }



  listarCampeonatos(){
    this.campeonatoService.listarTodosCampeonatosAtivos().subscribe(
      (res)=>{
        this.campeonatos = res
      });
  }
  listarCampeonatosById(id){
    this.campeonatoService.listarCampeonatoById(id).subscribe(
      (res)=>{
        this.times = res.times
      });
  }

  cadastrar() {
    let dtFormat = moment(this.form.get('dtJogo').value, 'DD-MM-YYYY hh:mm');
    this.form.controls['dtJogo'].setValue(dtFormat.format('YYYY-MM-DD HH:mm'))

    let jogo: Jogo = this.form.getRawValue();
    //console.log(this.form.getRawValue())

    this.jogoService.cadastrar(jogo).subscribe(
      (res) => {
        this.notificationService.showNotification('snackbar-success', 'Jogo cadastrado com sucesso!', 'top', 'right');
        this.form.get('time1_id').setValue('')
        this.form.get('time2_id').setValue('')
        //this.initForm();

      }, (err) => {
        console.log(err)
      });
      
      

  }

}
