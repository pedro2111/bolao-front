import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinalizarCampeonatoComponent } from './campeonato/finalizar-campeonato/finalizar-campeonato.component';
import { HomeCampeonatoComponent } from './campeonato/home-campeonato/home-campeonato.component';
import { NovoCampeonatoComponent } from './campeonato/novo-campeonato/novo-campeonato.component';
import { HomeTimeComponent } from './time/home-time/home-time.component';



const routes: Routes = [
  { path: 'campeonato', component: HomeCampeonatoComponent },
  { path: 'campeonato/novo', component: NovoCampeonatoComponent}, 
  { path: 'campeonato/editar/:id', component: NovoCampeonatoComponent}, 
  { path: 'campeonato/finalizar/:id', component: FinalizarCampeonatoComponent}, 
  { path: 'time', component: HomeTimeComponent}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
