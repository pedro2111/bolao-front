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
import { Time } from 'src/app/core/models/time.model';
import { PalpiteExtra } from 'src/app/core/models/palpiteExtra.model';
import { RankingExtra } from 'src/app/core/models/rankingExtra.model';
import { ɵangular_material_src_cdk_accordion_accordion_a } from '@angular/cdk/accordion';
import { BolaoParticipante } from 'src/app/core/models/bolaoParticipante.model';
import { BolaoParticipanteService } from 'src/app/core/service/bolao-participante.service';

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
  usuarioAtual = Number.parseInt(localStorage.getItem('usuarioId'));
  nomeUsuario = localStorage.getItem('nomeUsuario');
  jogos;
  rodadas;
  loadingJogos = false;

  bolaoId;
  bolao?:Bolao;
  palpites:Palpite[];
  rodadaAtual;
  horaInvalida = false;  
  indexInvalido;
  ranking?:Ranking[];
  rankingExtra?: RankingExtra[] = []
  criteriosBolao?:BolaoCriterio[];
  campeaoPts = 0;
  vicePts = 0;
  terceitoPts = 0;
  quartoPts = 0;
  formCampeao = new FormControl('', Validators.required);
  palpCampeaoId = null;
  formVice = new FormControl('', Validators.required);
  palpViceId = null;
  formTerceiro = new FormControl('', Validators.required);
  palpTerceiroId = null;
  formQuarto = new FormControl('', Validators.required);
  palpQuartoId = null;
  usuarioVisita = null;
  times:Time[] = [];
  participaBolao? = false;
  tabselected = 0;
  bolaoParticipantes:BolaoParticipante[] = [];

  

  constructor(
    private fb:FormBuilder,
    private jogoService:JogoService,
    private campeonatoService:CampeonatoService,
    private bolaoService:BolaoService,
    private bcService:BolaoCriterioService,
    private notificationService:NotificationService,
    private palpiteService:PalpiteService,
    private bpService:BolaoParticipanteService,
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
      
      if(param.get('IdUsuarioVisitado') != null){
        this.usuarioId = param.get('IdUsuarioVisitado');
        this.usuarioVisita = param.get('IdUsuarioVisitado');

      }      
        this.bolaoId = param.get('id');
        this.listarBolao(this.bolaoId);
        this.listarRanking(this.bolaoId);
        this.listarCriteriosBolao(this.bolaoId);
        this.listarParticipantes(this.bolaoId);

      this.listarPalpitesExtra(this.bolaoId,this.usuarioId);
      
    });
  
    this.initForm();
    
    
    this.filtroData.valueChanges.pipe(
      filter(value => value.length > 9),
      debounceTime(1000), 
      distinctUntilChanged(),
      switchMap(async (value) => {this.listarPalpitesUsuarioData(this.bolaoId, this.usuarioId, value)})
      ).subscribe();

  }
  changeTab(index){
    this.tabselected = index;
  }

  listarBolao(bolaoId){
    
    this.formCampeao.enable();
    this.formVice.enable();
    this.formTerceiro.enable();
    this.formQuarto.enable();
    this.bolaoService.listarBolaoById(bolaoId).subscribe(
      (res) => {
        this.bolao = res,
        this.listarRodadas(res.idCampeonato),
        this.listarRodadaAtual(res.idCampeonato),
        this.campeonatoId = res.idCampeonato,
        this.listarTimesCampeonato(res.idCampeonato)
               
        if((this.diffMinutes(res.dtLimitePalpiteExtra) && res.dtLimitePalpiteExtra.length > 0) || !this.permissaoPalpitar()){
          this.formCampeao.disable();
          this.formVice.disable();
          this.formTerceiro.disable();
          this.formQuarto.disable();
        }
      }, (err) => {
        console.log(err)
      });

  }
  listarTimesCampeonato(campeonatoId){

    this.campeonatoService.listarCampeonatoById(campeonatoId).subscribe(
      (res) => {
        this.times = res.times
      },(err) => {
        console.log(err)
      }
    );

  }
  listarPalpitesExtra(bolaoId,usuarioId){
    
    this.palpiteService.listarPalpiteExtra(bolaoId,usuarioId).subscribe(
      (res) => {
        this.carregaPalpitesExtras(res)
      },(err) => {
        console.log(err)
      }
    );

  }
  carregaPalpitesExtras(palpiteExtra:PalpiteExtra[]){

    if(palpiteExtra.length > 0){
      palpiteExtra.forEach((pe) =>{
        if(pe.idCriterio == 5){
          this.formCampeao.setValue(pe.idTime);
          this.palpCampeaoId = pe.id
        }
        if(pe.idCriterio == 6){
          this.formVice.setValue(pe.idTime);
          this.palpViceId = pe.id
        }
        if(pe.idCriterio == 7){
          this.formTerceiro.setValue(pe.idTime);
          this.palpTerceiroId = pe.id
        }
        if(pe.idCriterio == 8){
          this.formQuarto.setValue(pe.idTime);
          this.palpQuartoId = pe.id
        }

      });
    }
    

  }
  listarRanking(bolaoId){
    
    this.bolaoService.listarRanking(bolaoId).subscribe(
      (res) => {
        this.ranking = res
        
      }, (err) => {
        console.log(err)
      }
    );
    this.bolaoService.listarRankingExtra(bolaoId).subscribe(
      (res) => {
        this.rankingExtra = res;
        this.buildRanking();
        
      }, (err) => {
        console.log(err)
      }
    );
  }
  listarParticipantes(bolaoId){
    
    this.bpService.listarBolaoParticipantes(bolaoId).subscribe(
      (res) => {
        this.verificaParticipacaoBolao(res);
      });
  }
  verificaParticipacaoBolao(bolaoParticipantes:BolaoParticipante[]){
    
    bolaoParticipantes.forEach((bp) => {
      if(bp.idParticipante === this.usuarioAtual){
        
        this.participaBolao = true;
      }
    });
  }
  buildRanking(){
    
    for(let i in this.ranking){
      this.rankingExtra.forEach((re) => {
        if(this.ranking[i].nome === re.nome){
          this.ranking[i]['totalpontos'] = parseInt(this.ranking[i].totalpontosganho) + parseInt(re.totalpontosganho);
          this.ranking[i]['totalpontosganhoextra'] = re.totalpontosganho;
          this.ranking[i]['campeao'] = re.campeao;
          this.ranking[i]['vice'] = re.vice;
          this.ranking[i]['terceiro'] = re.terceiro;
          this.ranking[i]['quarto'] = re.quarto;
        }
      });

      this.ranking.sort((a,b) => {
        
        return b['totalpontos'] - a['totalpontos'] || b['pe'] - a['pe'] || b['rcg'] - a['rcg'] || b['rc'] - a['rc'] || b['ge'] - a['ge']
      })
      
    }

  }
  comparePontos(a,b){
    if(a.totalpontos < b.totalpontos){
      return -1;
    }
    if(a.totalpontos > b.totalpontos){
      return 1;
    }
    return 0;

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
    
    if(dtJogo != null){

    let now = moment();
    let dataJogo = moment(new Date(dtJogo[0],dtJogo[1]-1,dtJogo[2],dtJogo[3],dtJogo[4]+1));
       
    if(dataJogo.diff(now, 'minutes') > 0){
      return false;
    
    }else{
      return true;
    }

    }else{
      return false;
    }
    
   
  }
  atualizarPalpiteExtra(criterioId,timeId){
    
    let palpiteExtraCadastrar = {
      "bolao_id":this.bolaoId,
      "usuario_id":this.usuarioId,
      "criterio_id":criterioId,
      "time_id":timeId
    } 
    let palpiteExtraAtualizar = {
      "palpite_id":'',
      "time_id":timeId
    } 
    
    if(criterioId == 5 && this.palpCampeaoId == null){
      this.palpiteService.cadastrarPalpiteExtra(palpiteExtraCadastrar).subscribe(
        (res) => {
          this.listarPalpitesExtra(this.bolaoId,this.usuarioId);
        },(err) => {
          console.log(err)
        });
      
    
    }else if(criterioId == 5 && this.palpCampeaoId != null){

      palpiteExtraAtualizar.palpite_id = this.palpCampeaoId;
      this.palpiteService.atualizarPalpiteExtra(palpiteExtraAtualizar).subscribe(
        (res) => {

        },(err) => {
          console.log(err)
        }
      );

    }
    
    if(criterioId == 6 && this.palpViceId == null){
      this.palpiteService.cadastrarPalpiteExtra(palpiteExtraCadastrar).subscribe(
        (res) => {
          this.listarPalpitesExtra(this.bolaoId,this.usuarioId);
        },(err) => {
          console.log(err)
        });
    
    }else if(criterioId == 6 && this.palpViceId != null){

      palpiteExtraAtualizar.palpite_id = this.palpViceId;
      this.palpiteService.atualizarPalpiteExtra(palpiteExtraAtualizar).subscribe(
        (res) => {

        },(err) => {
          console.log(err)
        }
      );

    }

    if(criterioId == 7 && this.palpTerceiroId == null){
      this.palpiteService.cadastrarPalpiteExtra(palpiteExtraCadastrar).subscribe(
        (res) => {
          this.listarPalpitesExtra(this.bolaoId,this.usuarioId);
        },(err) => {
          console.log(err)
        });
    
    }else if(criterioId == 7 && this.palpTerceiroId != null){

      palpiteExtraAtualizar.palpite_id = this.palpTerceiroId;
      this.palpiteService.atualizarPalpiteExtra(palpiteExtraAtualizar).subscribe(
        (res) => {

        },(err) => {
          console.log(err)
        }
      );

    }

    if(criterioId == 8 && this.palpQuartoId == null){
      this.palpiteService.cadastrarPalpiteExtra(palpiteExtraCadastrar).subscribe(
        (res) => {
          this.listarPalpitesExtra(this.bolaoId,this.usuarioId);
        },(err) => {
          console.log(err)
        });
    
    }else if(criterioId == 8 && this.palpQuartoId != null){

      palpiteExtraAtualizar.palpite_id = this.palpQuartoId;
      this.palpiteService.atualizarPalpiteExtra(palpiteExtraAtualizar).subscribe(
        (res) => {

        },(err) => {
          console.log(err)
        }
      );

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
  permissaoPalpitar(){
    return (this.usuarioVisita != null && this.participaBolao && this.usuarioAtual == this.usuarioVisita);
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
        placarTime1: [{value:'', disabled: this.diffMinutes(j.dtJogo) || !this.permissaoPalpitar() }, Validators.required],
        placarTime2: [{value:'', disabled: this.diffMinutes(j.dtJogo) || !this.permissaoPalpitar()}, Validators.required],
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
