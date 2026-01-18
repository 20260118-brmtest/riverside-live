import { Component, OnInit, signal } from '@angular/core';
import { PlayerDto } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-players',
  imports: [MatTableModule, RouterLink],
  templateUrl: './players.html',
  styleUrl: './players.scss',
})
export class Players implements OnInit {
  protected readonly players = signal([] as PlayerDto[]);

  protected readonly columnsToDisplay: (keyof PlayerDto)[] = ['id', 'name', 'emaNumber'];

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.playerService.getPlayers().subscribe((players) => this.players.set(players));
  }
}
