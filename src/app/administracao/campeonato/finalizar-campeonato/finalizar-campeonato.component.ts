import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-finalizar-campeonato',
  templateUrl: './finalizar-campeonato.component.html',
  styleUrls: ['./finalizar-campeonato.component.sass']
})
export class FinalizarCampeonatoComponent implements OnInit {

  form:FormGroup;
  
  constructor() { }

  ngOnInit(): void {
  }

}
