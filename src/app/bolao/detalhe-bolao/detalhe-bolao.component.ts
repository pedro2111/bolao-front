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
import { ActivatedRoute } from '@angular/router';
import { Bolao } from 'src/app/core/models/bolao.model';
import { BolaoService } from 'src/app/core/service/bolao.service';
import { Palpite } from 'src/app/core/models/palpite.model';
import { PalpiteService } from 'src/app/core/service/palpite.service';

@Component({
  selector: 'app-detalhe-bolao',
  templateUrl: './detalhe-bolao.component.html',
  styleUrls: ['./detalhe-bolao.component.sass']
})
export class DetalheBolaoComponent implements OnInit {

  form: FormGroup;
  filterRadio?;
  campeonatoId?;
  filtro = new FormControl();
  filtroRodada = new FormControl();
  filtroData = new FormControl();
  usuarioId = localStorage.getItem('usuarioId');
  jogos;
  rodadas;
  loadingJogos = false;

  bolaoId;
  bolao:Bolao;
  palpites:Palpite[];

  constructor(
    private fb:FormBuilder,
    private jogoService:JogoService,
    private campeonatoService:CampeonatoService,
    private bolaoService:BolaoService,
    private notificationService:NotificationService,
    private palpiteService:PalpiteService,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((param) => {
      this.bolaoId = param.get('id');
      this.listarBolao(this.bolaoId);
      this.listarPalpitesUsuario(this.bolaoId,this.usuarioId);
    });
  
    this.initForm();
      
    
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

  listarBolao(bolaoId){
    this.bolaoService.listarBolaoById(bolaoId).subscribe(
      (res) => {
        this.bolao = res,
        this.listarRodadas(res.idCampeonato),
        this.campeonatoId = res.idCampeonato
      });

  }
  listarPalpitesUsuario(bolaoId,usuarioId){

    this.palpiteService.listarPalpitesUsuarioBolao(bolaoId,usuarioId).subscribe(
      (res) => {
        this.palpites = res
      }
    );
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
  

  listarJogosData(data:string){
    let dt = moment(data, 'DD-MM-YYYY');
    let dataFormatada = dt.format('YYYY-MM-DD');

    this.jogoService.listarPorData(this.campeonatoId, dataFormatada).subscribe(
      (res) => {
        this.jogos = res,
        this.addJogos(res)
        //console.log(moment(res[0].dtJogo, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY HH:mm"))
      },(err) => {
        console.log(err)
      })

  }

  listarJogosRodada(rodada){
    this.jogoService.listarPorRodada(this.campeonatoId, rodada).subscribe(
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
    //console.log(this.jogosF.getRawValue()[index])
    

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
    let palpite:Palpite[] = [];
   

    jogos.forEach((j) => {
      palpite = this.palpites.filter((p) => {return p.idJogo == j.id})

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
        placarTime1: palpite.length >0 ? palpite[0].placarTime1 : '', 
        placarTime2: palpite.length >0  ? palpite[0].placarTime2 : '', 
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
