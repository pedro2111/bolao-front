import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { Time } from 'src/app/core/models/time.model';
import { TimeService } from 'src/app/core/service/time.service';

@Component({
  selector: 'app-home-time',
  templateUrl: './home-time.component.html',
  styleUrls: ['./home-time.component.sass']
})
export class HomeTimeComponent implements OnInit {

  dataSource = new MatTableDataSource<Time>();
  times:Time[];

  displayedColumns: string[] = [
    'id',
    'nome',
    'actionsColumn'
  ];

  constructor(
    private timeService:TimeService
  ) { }

  ngOnInit(): void {

    this.timeService.listarTimes().subscribe(
      (res:Time[])=>{
        this.times = res
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
