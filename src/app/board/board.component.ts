import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { delay } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit {
  @Input() width: number = 0;
  @Input() height: number = 0;
  board: number[][] = Array<number[]>();
  public gameSpeed: number = 1;
  errorLog = '';
  position: { x: number; y: number } = { x: 5, y: 0 };
  shapes: { [key: string]: number[][] } = {
    square: [
      [1, 1],
      [1, 1],
    ],
    stick: [[1, 1, 1, 1]],
    zet: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    leftZet: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    tee: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    l: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    leftL: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  };
  nextShape: number[][] = [];
  shape: number[][] = [];
  gameLoop: any;
  shiftPressed = false;
  arrowUpPressed = false;
  ngOnInit() {}

  start() {
    this.board = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => 0)
    );
    this.position = { x: 5, y: 0 };
    this.changeShape();
    this.changeShape();
    this.drawShape();
    if (this.gameLoop === undefined) this.loop();
  }

  loop() {
    this.gameLoop = setInterval(() => {
      this.clearShape();
      this.goDown();
      this.drawShape();
    }, 1000);
  }

  goDown() {
    if (this.checkColision(this.position.y + 1, this.position.x)) {
      this.checkGameOver();
      this.mergeShapeIntoBoard();
      this.cleanRow();
      this.position.y = 0;
      this.changeShape();
    } else {
      this.updatePosition(this.position.y + 1, this.position.x);
    }
  }

  checkColision(newY: number, newX: number) {
    let hasColision = false;

    for (let y = 0; y < this.shape.length; y++) {
      if (this.board[newY + y] === undefined) {
        hasColision = true;
      } else {
        for (let x = 0; x < this.shape[y].length; x++) {
          if (this.board[newY + y][newX + x] !== 0) {
            hasColision = true;
          }
        }
      }
    }

    return hasColision;
  }

  checkGameOver(): boolean {
    this.drawShape();
    const end = this.board[0].some((cell) => cell === 1);
    if (end) this.stopGame();
    this.clearShape();
    return end;
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  changeShape(): void {
    const keys = Object.keys(this.shapes);
    this.shape = this.nextShape;
    const random = this.getRandomInt(0, keys.length - 1);
    const key = keys[random];
    if (this.shapes[key] === undefined) {
      console.log('La seleccion de shape es undefined');
    }
    this.nextShape = this.shapes[key];
  }

  updatePosition(newY: number, newX: number) {
    if (this.checkColision(newY, newX)) {
      console.log('Colision con algo al decender.');
      console.log('Se procede a unificar tabledo y figura.');
      this.mergeShapeIntoBoard();
      this.position.y = 0;
      this.changeShape();
    } else {
      this.position.y = newY;
      this.position.x = newX;
    }
  }

  mergeShapeIntoBoard() {
    this.drawShape();
  }

  stopGame() {
    clearInterval(this.gameLoop);
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.shiftPressed = true;
    }
    if (event.key === 'ArrowUp') {
      this.arrowUpPressed = true;
    }
    this.checkCombination();
  }

  checkCombination() {
    if (this.shiftPressed && this.arrowUpPressed) {
      console.log('Shift + ArrowUp combination pressed');
      // Realiza cualquier acción que desees aquí
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.shiftPressed = false;
    }
    if (event.key === 'ArrowUp') {
      this.arrowUpPressed = false;
    }
  }

  @HostListener('keydown', ['$event'])
  move(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();

    console.log('entro flechita: ' + event.key);
    switch (event.key) {
      case 'ArrowUp': {
        this.clearShape();
        const newShape = this.shape[0].map((val, index) =>
          this.shape.map((row) => row[index])
        );
        this.shape =
          this.shiftPressed && this.arrowUpPressed
            ? newShape
            : newShape.reverse();
        this.drawShape();
        break;
      }
      case 'ArrowRight': {
        this.clearShape();
        if (!this.checkColision(this.position.y, this.position.x + 1))
          this.updatePosition(this.position.y, this.position.x + 1);
        this.drawShape();
        break;
      }
      case 'ArrowLeft': {
        this.clearShape();
        if (!this.checkColision(this.position.y, this.position.x - 1))
          this.updatePosition(this.position.y, this.position.x - 1);
        this.drawShape();
        break;
      }
      case 'ArrowDown': {
        this.clearShape();
        this.updatePosition(this.position.y + 1, this.position.x);
        this.drawShape();
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }

  cleanRow() {
    let rowsCleaned = 0;
    for (let i = this.board.length - 1; i > 0; i--) {
      if (this.board[i].every((cell) => cell === 1)) {
        this.board.splice(i, 1);
        rowsCleaned++;
      }
    }
    for (let i = 0; i < rowsCleaned; i++) {
      this.board.unshift(Array.from({ length: this.width }, () => 0));
    }
  }

  drawShape() {
    if (this.shape === undefined) {
      console.log('Intenta dibujar un shape undefined');
    }
    for (let y = 0; y < this.shape.length; y++) {
      if (this.shape[y] === undefined) {
        console.log('Intenta dibujar un shape undefined dentro del for');
      }
      for (let x = 0; x < this.shape[y].length; x++) {
        this.board[this.position.y + y][this.position.x + x] = this.shape[y][x];
      }
    }
  }

  clearShape() {
    if (this.shape === undefined) {
      console.log('intenta borrar un shape undefined');
    }
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y] === undefined) {
          console.log('Intenta borrar un shape undefined dentro del for');
        }
        this.board[this.position.y + y][this.position.x + x] = 0;
      }
    }
  }
}
