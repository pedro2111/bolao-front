import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BolaoRoutingModule } from './bolao-routing.module';
import { HomeBolaoComponent } from './home-bolao/home-bolao.component';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule} from '@angular/material/button';
import { MatDividerModule} from '@angular/material/divider';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [ HomeBolaoComponent],
  imports: [
    CommonModule,
    BolaoRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    NgxPaginationModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule


  ]
})
export class BolaoModule { }
