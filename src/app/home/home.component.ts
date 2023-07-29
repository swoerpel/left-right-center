import { Component, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

enum DiceRoll {
    Left = 'left',
    Right = 'right',
    Center = 'center',
    Dot = 'dot',
}

interface Player{
    index: number;
    count: number;
}

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    public configComplete: boolean = false;

    public players: Player[] = [];
    public startingCount: number = 50;
    public currentPlayerIndex: number = 0;
    public centerCount: number = 0;
    public playerCount: number = 8;
    public playSpeed: number = 100;

    public paused = true;

    public stopInterval$: Subject<void> = new Subject();

    public dictTextMap: Record<DiceRoll,string> = {
        [DiceRoll.Left]: 'L',
        [DiceRoll.Right]: 'R',
        [DiceRoll.Center]: 'C',
        [DiceRoll.Dot]: 'D',
    }

    public rolledDict: string[] = [];

    public maxCount: number = this.startingCount;

    constructor() { }

    ngOnInit() { 

        this.resetPlayers();

    }

    public submitConfig(payload: any){
        this.playerCount = payload.playerCount;
        this.startingCount = payload.startingCount;
        this.reset();
        this.configComplete = true; 
    }

    private resetPlayers(){
        this.players = new Array(this.playerCount).fill(0).map((_, i) => {
            return {
                index: i,
                count: this.startingCount,
            }
        })
    }

    public reset(){
        this.resetPlayers();
        this.currentPlayerIndex = 0;
        this.centerCount = 0;
        this.rolledDict = [];
        this.maxCount = this.startingCount;
        this.paused = true;
    }

    public toggleInterval(){
        this.paused = !this.paused;

        if(this.paused){
            this.stopInterval$.next();
        }else{
            interval(this.playSpeed).pipe(
                takeUntil(this.stopInterval$),
                tap(() => this.nextTurn()),
            ).subscribe()
        }

    }

    public nextTurn(){

        const remainingPlayers = this.players.filter((player) => player.count > 0);

        if(remainingPlayers.length === 1){
            this.stopInterval$.next();
            alert(`Player ${remainingPlayers[0].index + 1} wins!`);
            
            return;
        }

        if(this.players[this.currentPlayerIndex].count <= 0){
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            return;
        }


        const currentPlayer = this.players[this.currentPlayerIndex];


        const diceCount = (currentPlayer.count > 3) ? 3 : currentPlayer.count;

        const rolls: DiceRoll[] = new Array(diceCount).fill(0).map(() => this.getDiceRoll());

        rolls.forEach((roll) => {
            if(roll === DiceRoll.Left){
                const leftPlayerIndex = this.currentPlayerIndex === 0 ? this.players.length - 1 : this.currentPlayerIndex - 1;
                this.players[leftPlayerIndex].count += 1;
                this.players[this.currentPlayerIndex].count -= 1;
            }
            if(roll === DiceRoll.Right){
                const rightPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
                this.players[rightPlayerIndex].count += 1;
                this.players[this.currentPlayerIndex].count -= 1;
            }
            if(roll === DiceRoll.Center){
                this.centerCount += 1;
                this.players[this.currentPlayerIndex].count -= 1;
            }

        })

        this.rolledDict = rolls.map((roll) => this.dictTextMap[roll]);

        // this.maxCount = Math.max(...this.players.map((player) => player.count));

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;


    }

    public getDiceRoll(): DiceRoll{
        const options = [
            DiceRoll.Left,
            DiceRoll.Right,
            DiceRoll.Center,
            DiceRoll.Dot,
            DiceRoll.Dot,
            DiceRoll.Dot,
        ]
        return options[Math.floor(Math.random() * options.length)]; 
    }
}


