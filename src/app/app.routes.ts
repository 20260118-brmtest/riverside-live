import { Routes } from '@angular/router';
import { Players } from './players/players';
import { Standings } from './standings/standings';
import { Player } from './player/player';

export const routes: Routes = [
  { path: 'player/:id', component: Player },
  { path: 'players', component: Players },
  { path: '', component: Standings },
];
