import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { Bolao } from 'src/app/core/models/bolao.model';
import { Time } from 'src/app/core/models/time.model';
import { BolaoService } from 'src/app/core/service/bolao.service';
import { TimeService } from 'src/app/core/service/time.service';

@Component({
  selector: 'app-home-bolao',
  templateUrl: './home-bolao.component.html',
  styleUrls: ['./home-bolao.component.sass']
})
export class HomeBolaoComponent implements OnInit {

  dataSource = new MatTableDataSource<Bolao>();
  boloes:Bolao[];

  displayedColumns: string[] = [
    'id',
    'nome',
    'actionsColumn'
  ];

  constructor(
    private bolaoService:BolaoService
  ) { }

  ngOnInit(): void {

    this.bolaoService.listarAllBoloes().subscribe(
      (res:Bolao[])=>{
        this.boloes = res
        this.dataSource = new MatTableDataSource(res)
      
      }, (err) =>{
        console.log(err)
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editar(id){
    console.log(id)
  }


}
