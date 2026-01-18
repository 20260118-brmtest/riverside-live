import { Component, computed, signal } from '@angular/core';
import { Seat } from '../../models/seat.model';
import { SeatService } from '../../services/seat.service';
import { Standing } from '../../models/standing.model';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-standings',
  imports: [MatTableModule, RouterLink],
  templateUrl: './standings.html',
  styleUrl: './standings.scss',
})
export class Standings {
  private readonly seats = signal([] as Seat[]);

  protected readonly standings = computed(() => {
    const standingsMap = this.seats().reduce((standingsAgg, seat) => {
      if (!standingsAgg[seat.playerId]) {
        standingsAgg[seat.playerId] = {
          playerId: seat.playerId,
          playerName: seat.playerName,
          score: 0,
        };
      }

      if (seat.score !== undefined) {
        standingsAgg[seat.playerId].score += seat.score;
        standingsAgg[seat.playerId].score += seat.penalty || 0;
      }

      return standingsAgg;
    }, {} as { [playerId: number]: Standing });

    const sortedStandings = Object.values(standingsMap).sort((s1, s2) => s2.score - s1.score);

    sortedStandings.forEach((s, index) => {
      s.score = Math.round(s.score * 10) / 10;
      s.rank = index + 1;
    });

    return sortedStandings;
  });

  protected readonly standingsSections = computed(() => {
    const standingSectionLength = 20;

    const standings = this.standings().slice();

    const sections: Standing[][] = [];

    while (standings.length > standingSectionLength) {
      sections.push(standings.splice(0, standingSectionLength));
    }

    sections.push(standings);

    return sections;
  });

  protected readonly roundNumber = computed(() => {
    const completedSeats = this.seats().filter((s) => s.score !== undefined);

    if (completedSeats.length === 0) {
      return 0;
    }

    return completedSeats.sort((s1, s2) => s2.round - s1.round)[0].round;
  });

  protected readonly columnsToDisplay: (keyof Standing)[] = ['rank', 'playerName', 'score'];

  constructor(private seatService: SeatService) {}

  ngOnInit() {
    this.seatService.getSeats().subscribe((seats) => {
      this.seats.set(seats);
    });
  }
}
