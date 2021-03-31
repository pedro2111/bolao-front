import { Component, OnInit } from '@angular/core';
import { Campeonato } from 'src/app/core/models/campeonato.model';
import { CampeonatoService } from 'src/app/core/service/campeonato.service';

@Component({
  selector: 'app-home-campeonato',
  templateUrl: './home-campeonato.component.html',
  styleUrls: ['./home-campeonato.component.sass']
})
export class HomeCampeonatoComponent implements OnInit {


  constructor(
    private campeonatoService:CampeonatoService) { }

  campeonatos:Campeonato[] = [];
  totalElementos;
  p;
  page = 0;
  size = 4;

  ngOnInit(): void {

    this.listarCampeponatos(this.page,this.size)

  }

  listarCampeponatos(page,size){

    this.campeonatoService.listarCampeonatos(page,size).subscribe(
      (res) => {
        this.campeonatos = res['content']
        this.totalElementos = res['totalElements']

      }, (err) => {
        console.log(err)
      }
    );

  }

  getPage(page){
    this.page = page - 1;
    this.listarCampeponatos(this.page,this.size);
  }

}
