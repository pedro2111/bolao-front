import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeBolaoComponent } from './home-bolao/home-bolao.component';


const routes: Routes = [
  { path: '', component: HomeBolaoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BolaoRoutingModule { }
