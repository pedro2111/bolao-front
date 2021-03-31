import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AdministracaoRoutingModule } from './administracao-routing.module';

import { MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule} from '@angular/material/stepper';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatSelectModule} from '@angular/material/select';
import { MatChipsModule} from '@angular/material/chips';
import { MatAutocompleteModule} from '@angular/material/autocomplete';


import { NovoCampeonatoComponent } from './campeonato/novo-campeonato/novo-campeonato.component';
import { HomeCampeonatoComponent } from './campeonato/home-campeonato/home-campeonato.component';
import { FinalizarCampeonatoComponent } from './campeonato/finalizar-campeonato/finalizar-campeonato.component';



@NgModule({
  declarations: [HomeCampeonatoComponent, NovoCampeonatoComponent, FinalizarCampeonatoComponent],
  imports: [
    CommonModule,
    AdministracaoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MaterialFileInputModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule
  ]
})
export class AdministracaoModule { }
