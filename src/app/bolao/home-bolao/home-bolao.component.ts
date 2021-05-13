import { Component, OnInit } from '@angular/core';
import { Bolao } from 'src/app/core/models/bolao.model';
import { BolaoService } from 'src/app/core/service/bolao.service';

import {
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  filter,
  switchMap
} from "rxjs/operators";
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { BolaoParticipante } from 'src/app/core/models/bolaoParticipante.model';
import { BolaoParticipanteService } from 'src/app/core/service/bolao-participante.service';
import { NotificationService } from 'src/app/core/service/notification.service';

@Component({
  selector: 'app-home-bolao',
  templateUrl: './home-bolao.component.html',
  styleUrls: ['./home-bolao.component.sass']
})
export class HomeBolaoComponent implements OnInit {

  constructor(
    private bolaoService:BolaoService,
    private bpService:BolaoParticipanteService,
    private notificationService:NotificationService
    ) { }

  boloes:Bolao[] = []
  totalElementos;
  p;
  page = 0;
  size = 4;
  subject = new Subject<string>();
  pesquisa=''
  boloesInscritos:BolaoParticipante[] = [];
  idUsuarioLogado = localStorage.getItem('usuarioId');

  ngOnInit(): void {
    this.listarBoloes(this.page,this.size,this.pesquisa);
    this.listarBoloesIncritos(this.idUsuarioLogado);

    this.subject.pipe(
      map(value => value.trim()),
      filter(value => value.length > 2),
      debounceTime(1000), 
      distinctUntilChanged(),
      switchMap(async (value) => {this.listarBoloes(this.page, this.size,value)})
      ).subscribe();
  }

  public listarBoloesIncritos(idUsuarioLogado){

    this.bpService.listarBoloesIncritos(idUsuarioLogado).subscribe(
      (res) => {
        this.boloesInscritos = res
      }, (err) => {
        console.log(err)
      })

  }
  public listarBoloes(page,size,pesquisa){

    if(pesquisa){
      this.bolaoService.listarBoloes(page,size,pesquisa).subscribe(
        (res) => {
          this.boloes = res['content'],
          this.totalElementos = res['totalElements']
        },(err) => {
          console.log(err)
        });

    }else{
      this.bolaoService.listarBoloes(page,size,this.pesquisa).subscribe(
        (res) => {
          this.boloes = res['content'],
          this.totalElementos = res['totalElements']
        },(err) => {
          console.log(err)
        });
    }

  }

  getPage(page){
    this.page = page - 1;
    this.listarBoloes(this.page,this.size,'');
  }
  verificaParticipacao(idBolao, bolaoInscritos:BolaoParticipante[]){

    return bolaoInscritos.some(bi => bi.idBolao == idBolao);

  }
  participarBolao(bolaoId){
    
    this.bpService.cadastrar(bolaoId,this.idUsuarioLogado).subscribe(
      (res) => {
        this.notificationService.showNotificationDuration('snackbar-success', 'Parabéns! agora você faz parte bolão! Se ele for privado, aguarde o ADM aceitar!', 'bottom', 'center',7000);
        this.listarBoloesIncritos(this.idUsuarioLogado);
        //fazer aqui o redirecionamento
      },(err) => {
        console.log(err)
      })
  }
  pesquisar(event){
    const texto:string = event.target.value;
    if(texto.length <= 2 ){    
      this.listarBoloes(this.page,this.size,this.pesquisa);
    }else{
      this.subject.next(texto);
    }
    
    
  }

}
