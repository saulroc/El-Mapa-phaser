import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaPartida } from './nueva-partida';

const routes: Routes = [
  {
    path: '',
    component: NuevaPartida
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaPartidaRoutingModule {}
