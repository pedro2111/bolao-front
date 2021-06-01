import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampeonatoRoutingModule } from './campeonato-routing.module';
import { HomeCampeonatoComponent } from './home-campeonato/home-campeonato.component';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatDividerModule} from '@angular/material/divider';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [HomeCampeonatoComponent],
  imports: [
    CommonModule,
    CampeonatoRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    NgxPaginationModule,
    MatTooltipModule
  ]
})
export class CampeonatoModule { }
