import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { Campeonato } from 'src/app/core/models/campeonato.model';
import { CampeonatoService } from 'src/app/core/service/campeonato.service';

@Component({
  selector: 'app-home-campeonato',
  templateUrl: './home-campeonato.component.html',
  styleUrls: ['./home-campeonato.component.sass']
})
export class HomeCampeonatoComponent implements OnInit {

  dataSource = new MatTableDataSource<Campeonato>();
  campeonatos:Campeonato[];

  displayedColumns: string[] = [
    'id',
    'nome',
    'status',
    'actionsColumn'
  ];
  constructor(
    private campeonatoService:CampeonatoService
  ) { }

  ngOnInit(): void {
    this.campeonatoService.listarTodosCampeonatos().subscribe(
      (res:Campeonato[]) => {
        this.campeonatos = res
        this.dataSource = new MatTableDataSource(res)

      },(err) => {
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
