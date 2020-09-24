import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaPartidaRoutingModule } from './nueva-partida-routing.module';

import { NuevaPartida } from './nueva-partida';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaPartidaRoutingModule
  ],
  declarations: [NuevaPartida],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NuevaPartidaModule {}
