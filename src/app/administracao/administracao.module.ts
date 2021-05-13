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
import { NgxMaskModule } from 'ngx-mask';
import { MatRadioModule} from '@angular/material/radio';
import { MatCardModule} from '@angular/material/card';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule} from '@angular/material/checkbox';



import { NovoCampeonatoComponent } from './campeonato/novo-campeonato/novo-campeonato.component';
import { HomeCampeonatoComponent } from './campeonato/home-campeonato/home-campeonato.component';
import { FinalizarCampeonatoComponent } from './campeonato/finalizar-campeonato/finalizar-campeonato.component';
import { HomeTimeComponent } from './time/home-time/home-time.component';
import { NovoTimeComponent } from './time/novo-time/novo-time.component';
import { HomeJogoComponent } from './jogo/home-jogo/home-jogo.component';
import { NovoJogoComponent } from './jogo/novo-jogo/novo-jogo.component';
import { NovoBolaoComponent } from './bolao/novo-bolao/novo-bolao.component';
import { HomeBolaoComponent } from './bolao/home-bolao/home-bolao.component';



@NgModule({
  declarations: [HomeCampeonatoComponent, NovoCampeonatoComponent, FinalizarCampeonatoComponent, HomeTimeComponent, NovoTimeComponent, HomeJogoComponent, NovoJogoComponent, HomeBolaoComponent, NovoBolaoComponent],
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
    MatAutocompleteModule,
    NgxMaskModule,
    MatRadioModule,
    MatCardModule,
    MatTooltipModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatCheckboxModule
  ]
})
export class AdministracaoModule { }
