import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalheBolaoComponent } from './detalhe-bolao/detalhe-bolao.component';
import { HomeBolaoComponent } from './home-bolao/home-bolao.component';


const routes: Routes = [
  { path: '', component: HomeBolaoComponent },
  { path: 'espiar/:id', component: DetalheBolaoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BolaoRoutingModule { }
