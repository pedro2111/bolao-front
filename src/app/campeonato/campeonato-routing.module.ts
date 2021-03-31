import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCampeonatoComponent } from './home-campeonato/home-campeonato.component';

const routes: Routes = [
  { path: '', component: HomeCampeonatoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampeonatoRoutingModule { }
