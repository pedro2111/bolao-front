import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { BolaoRoutingModule } from './bolao-routing.module';
import { HomeBolaoComponent } from './home-bolao/home-bolao.component';
import { DetalheBolaoComponent } from './detalhe-bolao/detalhe-bolao.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatDividerModule} from '@angular/material/divider';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule} from '@angular/material/table';
import { MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgxMaskModule } from 'ngx-mask';
import { MatRadioModule} from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [ HomeBolaoComponent, DetalheBolaoComponent],
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
    MatFormFieldModule,  
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgxMaskModule,
    MatRadioModule,
    MatCardModule,
    MatTabsModule


  ]
})
export class BolaoModule { }
