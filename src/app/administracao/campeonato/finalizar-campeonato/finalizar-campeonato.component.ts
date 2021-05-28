import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Campeonato } from 'src/app/core/models/campeonato.model';
import { CampeonatoService } from 'src/app/core/service/campeonato.service';
import { startWith, switchMap, tap,map,debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/service/notification.service';
import { Bolao } from 'src/app/core/models/bolao.model';
import { BolaoService } from 'src/app/core/service/bolao.service';
import { PalpiteService } from 'src/app/core/service/palpite.service';

@Component({
  selector: 'app-finalizar-campeonato',
  templateUrl: './finalizar-campeonato.component.html',
  styleUrls: ['./finalizar-campeonato.component.sass']
})
export class FinalizarCampeonatoComponent implements OnInit {

  form:FormGroup;
  campeonato?:Campeonato;
  campeonato_id:number;
  boloes:Bolao[] = [];
  
  constructor(
    private fb:FormBuilder,
    private route:ActivatedRoute,
    private router:Router,
    private campeonatoService:CampeonatoService,
    private bolaoService:BolaoService,
    private palpiteService:PalpiteService,
    private notificationService:NotificationService) {
    this.initForm();
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param)=>{
      this.campeonato_id = Number.parseInt(param.get('id'));
      this.listarBoloesByCampeonato(param.get('id'));
      this.campeonatoService.listarCampeonatoById(param.get('id')).subscribe(
        (res) => {
          this.campeonato = res
        },(err) => {
          console.log(err)
        });
    })
  }

  initForm(){
    this.form = this.fb.group({
      campeao: ['', Validators.required],
      vice: ['', Validators.required],
      terceiro: ['', Validators.required],
      quarto: ['', Validators.required]
    });
  }

  listarBoloesByCampeonato(campeonatoId){

    this.bolaoService.listarBoloesByCampeonato(campeonatoId).subscribe(
      (res) => {
        this.boloes = res
      },(err) => {
        console.log(err)
      }
    );
  }
  calcularPontosGanhosExtra(boloes:Bolao[]){
    
    boloes.forEach((b) => {
      this.palpiteService.calcularPontosGanhosExtra(b.id).subscribe(
        (res) => {

        }, (err) =>{
          console.log(err)
        }
      );
    });
  }

  cadastrar(){
    let campeonato:Campeonato = new Campeonato();

    campeonato.id = this.campeonato_id;
    campeonato.campeao_id = this.form.get('campeao').value;
    campeonato.vice_id = this.form.get('vice').value;
    campeonato.terceiro_id = this.form.get('terceiro').value;
    campeonato.quarto_id = this.form.get('quarto').value;

    this.campeonatoService.finalizarCampeonato(this.campeonato_id, campeonato).subscribe(
      (res) => {
        this.notificationService.showNotification('snackbar-success', 'Campeonato finalizado com sucesso!', 'top', 'right');        

        this.calcularPontosGanhosExtra(this.boloes);
        setTimeout(()=>{
          this.router.navigate(['/administracao/campeonato']);
          
        },1000);
      },(err) => {
        console.log(err)
      });
  }

}
