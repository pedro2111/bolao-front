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

@Component({
  selector: 'app-home-bolao',
  templateUrl: './home-bolao.component.html',
  styleUrls: ['./home-bolao.component.sass']
})
export class HomeBolaoComponent implements OnInit {

  constructor(
    private bolaoService:BolaoService) { }

  boloes:Bolao[] = []
  totalElementos;
  p;
  page = 0;
  size = 4;
  subject = new Subject<string>();
  pesquisa=''

  ngOnInit(): void {
    this.listarBoloes(this.page,this.size,this.pesquisa);

    this.subject.pipe(
      map(value => value.trim()),
      filter(value => value.length > 2),
      debounceTime(1000), 
      distinctUntilChanged(),
      switchMap(async (value) => {this.listarBoloes(this.page, this.size,value)})
      ).subscribe();
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
  pesquisar(event){
    const texto:string = event.target.value;
    if(texto.length <= 2 ){    
      this.listarBoloes(this.page,this.size,this.pesquisa);
    }else{
      this.subject.next(texto);
    }
    
    
  }

}
