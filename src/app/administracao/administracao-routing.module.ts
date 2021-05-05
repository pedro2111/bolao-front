import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeBolaoComponent } from './bolao/home-bolao/home-bolao.component';
import { NovoBolaoComponent } from './bolao/novo-bolao/novo-bolao.component';
import { FinalizarCampeonatoComponent } from './campeonato/finalizar-campeonato/finalizar-campeonato.component';
import { HomeCampeonatoComponent } from './campeonato/home-campeonato/home-campeonato.component';
import { NovoCampeonatoComponent } from './campeonato/novo-campeonato/novo-campeonato.component';
import { HomeJogoComponent } from './jogo/home-jogo/home-jogo.component';
import { NovoJogoComponent } from './jogo/novo-jogo/novo-jogo.component';
import { HomeTimeComponent } from './time/home-time/home-time.component';
import { NovoTimeComponent } from './time/novo-time/novo-time.component';



const routes: Routes = [
  { path: 'campeonato', component: HomeCampeonatoComponent },
  { path: 'campeonato/novo', component: NovoCampeonatoComponent}, 
  { path: 'campeonato/editar/:id', component: NovoCampeonatoComponent}, 
  { path: 'campeonato/finalizar/:id', component: FinalizarCampeonatoComponent}, 

  { path: 'time', component: HomeTimeComponent}, 
  { path: 'time/novo', component: NovoTimeComponent}, 
  { path: 'time/editar/:id', component: NovoTimeComponent}, 

  { path: 'jogo', component: HomeJogoComponent}, 
  { path: 'jogo/novo', component: NovoJogoComponent}, 
  { path: 'jogo/editar/:id', component: NovoJogoComponent}, 

  { path: 'bolao', component: HomeBolaoComponent}, 
  { path: 'bolao/novo', component: NovoBolaoComponent}, 
  { path: 'bolao/editar/:id', component: NovoBolaoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
