import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, tap, zip } from 'rxjs';
import { Seat } from '../models/seat.model';
import { PlayerService } from './player.service';

@Injectable({ providedIn: 'root' })
export class SeatService {
  private seats?: Seat[];

  constructor(private http: HttpClient, private playerService: PlayerService) {}

  getSeats() {
    return this.seats
      ? of(this.seats)
      : zip(
          this.playerService.getPlayers(),
          this.http.get('/riverside-live/Riverside Manager - Seats.csv', {
            responseType: 'text',
          })
        ).pipe(
          map(([players, seatsResponse]) =>
            seatsResponse.split(/\r?\n/).map((seatText) => {
              const [id, round, table, wind, playerIdString, score, penalty] = seatText.split(',');
              const playerId = +playerIdString;
              return {
                id: +id,
                round: +round,
                table: +table,
                wind,
                playerId: playerId,
                playerName: players.find((p) => p.id === playerId)?.name,
                score: score === '' || score === undefined ? undefined : +score,
                penalty: penalty === '' || penalty === undefined ? undefined : +penalty,
              } as Seat;
            })
          ),
          tap((seats) => (this.seats = seats))
        );
  }
}
