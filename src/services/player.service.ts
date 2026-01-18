import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlayerDto } from '../models/player.model';
import { map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private players?: PlayerDto[];

  constructor(private http: HttpClient) {}

  getPlayers() {
    return this.players
      ? of(this.players)
      : this.http
          .get('/riverside-live/Riverside Manager - Players.csv', {
            responseType: 'text',
          })
          .pipe(
            map((r) =>
              r.split(/\r?\n/).map((playerText) => {
                const [id, name, emaNumber] = playerText.split(',');
                return {
                  id: +id,
                  name,
                  emaNumber,
                } as PlayerDto;
              })
            ),
            tap((players) => (this.players = players))
          );
  }
}
