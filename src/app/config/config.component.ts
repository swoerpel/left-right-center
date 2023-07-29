import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'config',
    templateUrl: 'config.component.html',
    styleUrls: ['config.component.scss']
})

export class ConfigComponent implements OnInit {

    playerCount = 5;
    startingBalance = 10;
    numberDice = 2;
    constructor() { }

    ngOnInit() { }
}