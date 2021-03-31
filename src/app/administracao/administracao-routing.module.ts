import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinalizarCampeonatoComponent } from './campeonato/finalizar-campeonato/finalizar-campeonato.component';
import { HomeCampeonatoComponent } from './campeonato/home-campeonato/home-campeonato.component';
import { NovoCampeonatoComponent } from './campeonato/novo-campeonato/novo-campeonato.component';



const routes: Routes = [
  { path: 'campeonato', component: HomeCampeonatoComponent },
  { path: 'campeonato/novo', component: NovoCampeonatoComponent}, 
  { path: 'campeonato/editar/:id', component: NovoCampeonatoComponent}, 
  { path: 'campeonato/finalizar/:id', component: FinalizarCampeonatoComponent}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
