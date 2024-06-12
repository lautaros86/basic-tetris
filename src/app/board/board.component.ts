import {Component, HostListener, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import { delay } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  @Input() width: number = 0;
  @Input() height: number = 0;
  board: number[][] = Array<number[]>();
  errorLog = ""
  position: {x: number, y: number} = {
    x: 5,
    y: 8
  }
  shapes: {[key: string]: number[][]} = {

    'square': [
      [1, 1],
      [1, 1]
    ],
    'stick': [
      [1, 1, 1, 1]
    ],
    'zet': [
      [0, 1],
      [1, 1],
      [1, 0]
    ],
    'leftZet': [
      [1, 0],
      [1, 1],
      [0, 1]
    ],
    'tee': [
      [1, 0],
      [1, 1],
      [1, 0]
    ],
    'l': [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    'leftL': [
      [0, 1],
      [0, 1],
      [1, 1]
    ]
}
  shape: number[][] = []

  gameLoop: any = null

  ngOnInit() {
    this.board = Array.from({length: this.height}, () => Array.from({length: this.width}, () => 0));
  }
  start() {
    this.shape = this.changeShape()
    this.loop()
  }

  loop() {
    this.drawShape()
    this.gameLoop = setInterval(() => {
      this.clearShape()
      if(this.checkColision(this.position.y + 1, this.position.x)) {
        console.log("rompio")
        //clearInterval(this.gameLoop)
        this.mergeShapeIntoBoard()
        this.position.y = 0
        this.changeShape()
      } else {
        this.updatePosition(this.position.y + 1, this.position.x)
      }
      this.drawShape()
    }, 1000);
  }

  drawShape() {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        this.board[this.position.y + y][this.position.x + x] = this.shape[y][x];
      }
    }
  }

  clearShape() {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        this.board[this.position.y + y][this.position.x + x] = 0;
      }
    }
  }

  changeShape(): number[][] {
    const keys = Object.keys(this.shapes)
    //return this.shapes[keys[Math.floor(Math.random() * keys.length-1)]]
    return this.shapes['square']
  }

  checkColision(newY: number, newX: number) {
    let hasColision = false
    for (let y = 0; y < this.shape.length; y++) {
      if(this.board[newY + y] === undefined) {
        hasColision = true
      } else {
        for (let x = 0; x < this.shape[y].length; x++) {
          if(this.board[newY + y][newX + x] !== 0) {
            hasColision = true
          }
        }
      }
    }
    return hasColision
  }

  updatePosition(newY: number, newX: number) {
    if(this.checkColision(newY, newX)) {
      console.log("rompio")
      //clearInterval(this.gameLoop)
      this.mergeShapeIntoBoard()
      this.position.y = 0
      this.changeShape()
    } else {
      this.position.y = newY
      this.position.x = newX
    }

  }

  mergeShapeIntoBoard() {
    this.drawShape()
  }

  stopGame() {
    clearInterval(this.gameLoop)
  }

  @HostListener('keydown', ['$event'])
  move(event: KeyboardEvent) {

    event.stopPropagation();
    event.preventDefault();

    console.log("entro flechita: " + event.key)
    switch(event.key) {
      case 'ArrowUp': {
        //rotar;
        break;
      }
      case 'ArrowRight': {
        this.clearShape()
        if(!this.checkColision(this.position.y, this.position.x + 1))
          this.updatePosition(this.position.y, this.position.x + 1)
        this.drawShape()
        break;
      }
      case 'ArrowLeft': {
        this.clearShape()
        if(!this.checkColision(this.position.y, this.position.x - 1))
          this.updatePosition(this.position.y, this.position.x - 1)
        this.drawShape()
        break;
      }
      case 'ArrowDown': {
        this.clearShape()
        this.updatePosition(this.position.y + 1, this.position.x)
        this.drawShape()
        break;
      }
      default: {
         //statements;
         break;
      }
   }
  }

}
