import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { Ranking } from 'src/app/core/models/ranking.model';
import { BolaoCriterio } from 'src/app/core/models/bolaoCriterio.model';
import { BolaoCriterioService } from 'src/app/core/service/bolao-criterio.service';

@Component({
  selector: 'app-detalhe-bolao',
  templateUrl: './detalhe-bolao.component.html',
  styleUrls: ['./detalhe-bolao.component.sass']
})
export class DetalheBolaoComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  filterRadio? = 1
  campeonatoId?;
  filtro = new FormControl();
  filtroRodada = new FormControl();
  filtroData = new FormControl();
  usuarioId = localStorage.getItem('usuarioId');
  nomeUsuario = localStorage.getItem('nomeUsuario');
  jogos;
  rodadas;
  loadingJogos = false;

  bolaoId;
  bolao:Bolao;
  palpites:Palpite[];
  rodadaAtual;
  horaInvalida = false;  
  indexInvalido;
  ranking?:Ranking[];
  criteriosBolao?:BolaoCriterio[];
  campeaoPts = 0;
  vicePts = 0;
  terceitoPts = 0;
  quartoPts = 0;
  

  constructor(
    private fb:FormBuilder,
    private jogoService:JogoService,
    private campeonatoService:CampeonatoService,
    private bolaoService:BolaoService,
    private bcService:BolaoCriterioService,
    private notificationService:NotificationService,
    private palpiteService:PalpiteService,
    private route:ActivatedRoute
  ) { }

  ngAfterViewInit():void{

    this.filtroRodada.valueChanges.subscribe(
      
      (res)=>{
        this.listarPalpitesUsuario(this.bolaoId,this.usuarioId,res)
        
      },(err) => {
        console.log(err)
      })
  }
  ngOnInit(): void {

    this.route.paramMap.subscribe((param) => {
      this.bolaoId = param.get('id');
      this.listarBolao(this.bolaoId);
      this.listarRanking(this.bolaoId);
      this.listarCriteriosBolao(this.bolaoId);
      //this.listarPalpitesUsuario(this.bolaoId,this.usuarioId,'');
    });
  
    this.initForm();
    
    
    this.filtroData.valueChanges.pipe(
      filter(value => value.length > 9),
      debounceTime(1000), 
      distinctUntilChanged(),
      switchMap(async (value) => {this.listarPalpitesUsuarioData(this.bolaoId, this.usuarioId, value)})
      ).subscribe();

  }

  listarBolao(bolaoId){
    this.bolaoService.listarBolaoById(bolaoId).subscribe(
      (res) => {
        this.bolao = res,
        this.listarRodadas(res.idCampeonato),
        this.listarRodadaAtual(res.idCampeonato),
        this.campeonatoId = res.idCampeonato
      }, (err) => {
        console.log(err)
      });

  }
  listarRanking(bolaoId){
    
    this.bolaoService.listarRanking(bolaoId).subscribe(
      (res) => {
        this.ranking = res
      }, (err) => {
        console.log(err)
      }
    );
  }
  listarCriteriosBolao(bolaoId){
    this.bcService.listarCriteriosBolao(bolaoId).subscribe(
      (res) => {
        this.criteriosBolao = res,
        this.definirCriteriosExtra(res)
      }, (err) => {
        console.log(err)
      }
    );
  }
  definirCriteriosExtra(bolaoCriterio: BolaoCriterio[]) {
    
    bolaoCriterio.forEach((bc) => {

      if(bc.idCriterio == 5){
        this.campeaoPts = bc.pontuacao;
      }
      if(bc.idCriterio == 6){
        this.vicePts = bc.pontuacao;
      }
      if(bc.idCriterio == 7){
        this.terceitoPts = bc.pontuacao;
      }
      if(bc.idCriterio == 8){
        this.quartoPts = bc.pontuacao;
      }
    });
  }

  listarPalpitesUsuario(bolaoId,usuarioId,rodada){

    this.palpiteService.listarPalpitesUsuarioBolao(bolaoId,usuarioId,rodada).subscribe(
      (res) => {
        this.palpites = res,
        this.listarJogosRodada(rodada)
      }
    );
  }
  listarPalpitesUsuarioData(bolaoId,usuarioId,data){
    let dt = moment(data, 'DD-MM-YYYY');
    let dataFormatada = dt.format('YYYY-MM-DD');

    this.palpiteService.listarPalpitesUsuarioBolaoData(bolaoId,usuarioId,dataFormatada).subscribe(
      (res) => {
        this.palpites = res,
        this.listarJogosData(data)        
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
  listarRodadaAtual(campeonatoId){
    this.jogoService.listarRodadaAtual(campeonatoId).subscribe(
      (res:string) => {
        this.rodadaAtual = res,
        this.listarPalpitesUsuario(this.bolaoId,this.usuarioId,res)        
        //this.listarJogosRodada(res)
      },(err) => {
        console.log(err)
      });
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

  diffMinutes(dtJogo):boolean{
    
    let now = moment();
    let dataJogo = moment(new Date(dtJogo[0],dtJogo[1]-1,dtJogo[2],dtJogo[3],dtJogo[4]+1));
       
    if(dataJogo.diff(now, 'minutes') > 0){
      return false;
    
    }else{
      return true;
    }
   
  }
  atualizarPalpite(index){

    let now = moment();
    this.horaInvalida = false;
    this.indexInvalido = -1;
    let placarTime1 = this.jogosF.getRawValue()[index]['placarTime1'];
    let placarTime2 = this.jogosF.getRawValue()[index]['placarTime2'];
    let jogo_id = this.jogosF.getRawValue()[index]['id'];
    let palpiteId = this.jogosF.getRawValue()[index]['palpiteId'];
    let rodada = this.jogosF.getRawValue()[index]['rodada'];
    let dataJogo = moment(this.jogosF.getRawValue()[index]['dtJogo'],'DD-MM-YYYY HH:mm' );
    //fazer um put map do palpite. Aqui verifiar se tem o palpite id, se tiver atualização senao novo cadastro 
   
    let palpiteCadastrar = {
      "bolao_id":this.bolaoId,
      "jogo_id":jogo_id,
      "usuario_id":this.usuarioId,
      "placarTime1":placarTime1,
      "placarTime2":placarTime2
    }    
    let palpiteAtualizar = {
      "palpite_id": palpiteId,
      "placarTime1":placarTime1,
      "placarTime2":placarTime2
    }    

    if(placarTime1 != null && placarTime1 != ""  && placarTime2 != null && placarTime2 != ""){
      
      if(dataJogo.diff(now, 'minutes')+1 > 0){
        if(palpiteId > 0){
        
          this.palpiteService.atualizar(palpiteAtualizar).subscribe(
            (res) => {
  
            },(err) => {
              console.log(err)
            });

        }else{
          this.palpiteService.cadastrar(palpiteCadastrar).subscribe(
            (res) =>{
              if(this.filterRadio == 1){
                this.listarPalpitesUsuario(this.bolaoId,this.usuarioId,rodada);
  
              }else{
                this.listarPalpitesUsuarioData(this.bolaoId, this.usuarioId, this.filtroData.value)
  
              }      
            },
            (err) =>{
              console.log(err)
            }
          );
        } 

      }else{
        this.horaInvalida = true;
        this.indexInvalido = index;

      }      
        
    }    
  }
  getPontosGanho(idJogo){
    let palpite:Palpite[] = this.palpites.filter((p) => {return p.idJogo == idJogo && p.idUsuario == parseInt(this.usuarioId)})

    return palpite.length >0 ? palpite[0].pontosGanho : 0
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
        palpiteId:[''],
        placarTime1: [{value:'', disabled: this.diffMinutes(j.dtJogo)}, Validators.required],
        placarTime2: [{value:'', disabled: this.diffMinutes(j.dtJogo)}, Validators.required],
        status: [''],
        dtJogo: [dataJogo],
        nomeTime1:[''],
        nomeTime2:[''],
        urlTime1:[''],
        urlTime2:[''],
        local: [''],
        rodada: [j.rodada]
      });

      jogosForm.setValue({
        id:j.id,
        palpiteId: palpite.length >0 ? palpite[0].id : '',
        placarTime1: palpite.length >0 ? palpite[0].placarTime1 : '', 
        placarTime2: palpite.length >0 ? palpite[0].placarTime2 : '', 
        status:'',
        dtJogo:dataJogo,
        nomeTime1:j.nomeTime1,
        nomeTime2:j.nomeTime2,
        urlTime1:j.urlTime1,
        urlTime2:j.urlTime2,
        local: j.local,
        rodada: j.rodada,
       });
      this.jogosF.push(jogosForm);
    })
    this.loadingJogos = true;

   // console.log(this.jogosF.controls)
    
  }

}
