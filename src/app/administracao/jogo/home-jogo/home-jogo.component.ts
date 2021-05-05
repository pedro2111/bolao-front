import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CampeonatoService } from 'src/app/core/service/campeonato.service';
import { JogoService } from 'src/app/core/service/jogo.service';
import { NotificationService } from 'src/app/core/service/notification.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  filter,
  switchMap
} from "rxjs/operators";
import * as moment from 'moment';
import { Jogo } from 'src/app/core/models/jogo.model';

@Component({
  selector: 'app-home-jogo',
  templateUrl: './home-jogo.component.html',
  styleUrls: ['./home-jogo.component.sass']
})
export class HomeJogoComponent implements OnInit {

  form: FormGroup;
  filterRadio? = 2;
  campeonatoId?;
  filtro = new FormControl();
  filtroRodada = new FormControl();
  filtroData = new FormControl();
  filtroCampeonato = new FormControl('nulo');
  criador_id = localStorage.getItem('usuarioId');
  campeonatos;
  jogos;
  rodadas;
  loadingJogos = false;
  
  constructor(
    private fb:FormBuilder,
    private jogoService:JogoService,
    private campeonatoService:CampeonatoService,
    private notificationService:NotificationService
  ) { }

  ngOnInit(): void {
    this.listarCampeonatos();   
    this.initForm();
      
    this.filtroCampeonato.valueChanges.subscribe(
      (res)=>{
        this.listarRodadas(res);
        
      },(err) => {
      })

    this.filtroRodada.valueChanges.subscribe(
      (res)=>{
        this.listarJogosRodada(res);
      },(err) => {
        console.log(err)
      })
    
    this.filtroData.valueChanges.pipe(
      filter(value => value.length > 9),
      debounceTime(1000), 
      distinctUntilChanged(),
      switchMap(async (value) => {this.listarJogosData(value)})
      ).subscribe();

  }

  listarRodadas(campeonatoId){

    if(campeonatoId != undefined){
      this.jogoService.listarRodadasCampeonato(campeonatoId).subscribe(
        (res) => {
          this.rodadas = res;
      },(err) => {
        console.log(err)
      })

    }
    
  }
  listarCampeonatos(){
    this.campeonatoService.listarTodosCampeonatosAtivos().subscribe(
      (res)=>{
        this.campeonatos = res;
      });
  }

  listarJogosData(data:string){
    let dt = moment(data, 'DD-MM-YYYY');
    let dataFormatada = dt.format('YYYY-MM-DD');

    this.jogoService.listarPorData(this.filtroCampeonato.value, dataFormatada).subscribe(
      (res) => {
        this.jogos = res,
        this.addJogos(res)
        //console.log(moment(res[0].dtJogo, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY HH:mm"))
      },(err) => {
        console.log(err)
      })

  }

  listarJogosRodada(rodada){
    this.jogoService.listarPorRodada(this.filtroCampeonato.value, rodada).subscribe(
      (res) => {
        this.jogos = res,
        this.addJogos(res)
       }, (err) => {
         console.log(err)
       })

  }
  atualizarJogo(index){

    let placarTime1 = this.jogosF.getRawValue()[index]['placarTime1'];
    let placarTime2 = this.jogosF.getRawValue()[index]['placarTime2'];
    let status = this.jogosF.getRawValue()[index]['status'];
    let id = this.jogosF.getRawValue()[index]['id'];
    
    let jogo = new Jogo();
    jogo.id = id;
    jogo.placarTime1 = placarTime1;
    jogo.placarTime2 = placarTime2;
    jogo.status = status;

    if(placarTime1 != null && placarTime1 != ""  && placarTime2 != null && placarTime2 != ""){
      
      this.jogoService.atualizar(jogo).subscribe(
        (res)=>{
          
        }, (err) => {
          console.log(err)
        });

    }

  }
  cadastrar(){
    //console.log(this.form.getRawValue())

  }

  initForm(){
    this.form = this.fb.group({
      jogos: this.fb.array([])
    });
  }
  
  get jogosF(){

    return this.form.controls['jogos'] as FormArray;
  }

  addJogos(jogos:Jogo[]){
    
    this.jogosF.clear();
   

    jogos.forEach((j) => {
      let dataJogo = moment(j.dtJogo, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY HH:mm")
      const jogosForm = this.fb.group({
        id:[''],
        placarTime1: ['', Validators.required],
        placarTime2: ['', Validators.required],
        status: ['ANDAMENTO'],
        dtJogo: [dataJogo],
        nomeTime1:[''],
        nomeTime2:[''],
        urlTime1:[''],
        urlTime2:[''],
        local: ['']
      });

      jogosForm.setValue({
        id:j.id,
        placarTime1: j.placarTime1, 
        placarTime2: j.placarTime2, 
        status:'ANDAMENTO',
        dtJogo:dataJogo,
        nomeTime1:j.nomeTime1,
        nomeTime2:j.nomeTime2,
        urlTime1:j.urlTime1,
        urlTime2:j.urlTime2,
        local: j.local
       });
      this.jogosF.push(jogosForm);
    })
    this.loadingJogos = true;

   // console.log(this.jogosF.controls)
    
  }

}
