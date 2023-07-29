import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'config',
    templateUrl: 'config.component.html',
    styleUrls: ['config.component.scss']
})

export class ConfigComponent implements OnInit {

    playerCount = 5;
    startingBalance = 10;
    numberDice = 2;
    @Output() submit: EventEmitter<any> = new EventEmitter();


    constructor() { }

    ngOnInit() { }

    public onSubmit(){
        
        this.submit.emit({
            playerCount: 9,
            startingCount: 50,
            numberOfDice: 3,
        });
    }

    // public incPlayerCount(){
    //     this.playerCount++;
    // }
    // public decPlayerCount(){
    //     this.playerCount--;
    // }
}