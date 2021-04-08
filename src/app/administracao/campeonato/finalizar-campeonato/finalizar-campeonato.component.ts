import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Campeonato } from 'src/app/core/models/campeonato.model';
import { CampeonatoService } from 'src/app/core/service/campeonato.service';
import { startWith, switchMap, tap,map,debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/service/notification.service';

@Component({
  selector: 'app-finalizar-campeonato',
  templateUrl: './finalizar-campeonato.component.html',
  styleUrls: ['./finalizar-campeonato.component.sass']
})
export class FinalizarCampeonatoComponent implements OnInit {

  form:FormGroup;
  campeonato?:Campeonato;
  campeonato_id:number;
  
  constructor(
    private fb:FormBuilder,
    private route:ActivatedRoute,
    private router:Router,
    private campeonatoService:CampeonatoService,
    private notificationService:NotificationService) {
    this.initForm();
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param)=>{
      this.campeonato_id = Number.parseInt(param.get('id')) 
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

        setTimeout(()=>{this.router.navigate(['/administracao/campeonato'])},1000);
      },(err) => {
        console.log(err)
      });
  }

}
