import { Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';
import { SeatService } from '../../services/seat.service';
import { Seat } from '../../models/seat.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { PlayerDto } from '../../models/player.model';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-player',
  imports: [MatTableModule, RouterLink],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class Player {
  protected playerId = signal(0);

  protected readonly player = signal<PlayerDto | undefined>(undefined);

  protected readonly hanchans = computed(() => {
    return this.playerSeats().map((playerSeat) =>
      this.seats()
        .filter((s) => s.round === playerSeat.round && s.table === playerSeat.table)
        .sort((s1, s2) =>
          s1.score !== undefined && s2.score !== undefined ? s2.score - s1.score : s1.id - s2.id
        )
    );
  });

  protected readonly penaltySeats = computed(() => {
    return this.playerSeats().filter((playerSeat) => playerSeat.penalty);
  });

  protected readonly hanchanColumnsToDisplay: (keyof Seat)[] = [
    'playerId',
    'playerName',
    'wind',
    'score',
  ];

  private readonly seats = signal([] as Seat[]);

  private readonly playerSeats = computed(() =>
    this.seats().filter((s) => s.playerId === this.playerId())
  );

  private readonly activatedRoute = inject(ActivatedRoute);

  constructor(private seatService: SeatService, private playerService: PlayerService) {}

  ngOnInit() {
    combineLatest([
      this.seatService.getSeats(),
      this.playerService.getPlayers(),
      this.activatedRoute.params,
    ]).subscribe(([seats, players, params]) => {
      this.playerId.set(+params['id']);

      this.seats.set(seats);

      this.player.set(players.find((p) => p.id == this.playerId()));
    });
  }
}
