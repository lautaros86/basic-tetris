import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShapeService } from '../services/shape.service';
import { BoardService } from '../services/board.service';

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

  gameLoop: any;
  freeze: boolean = false;

  shiftPressed = false;
  arrowUpPressed = false;

  board: number[][] = [];

  constructor(
    private shapeService: ShapeService,
    private boardService: BoardService
  ) {}

  ngOnInit() {}

  start() {
    this.boardService.initBoard(this.height, this.width);
    this.board = this.boardService.getBoard();
    this.shapeService.changeShape();
    this.shapeService.changeShape();
    this.boardService.drawShape(this.shapeService.getShape());
    this.freeze = false;
    if (this.gameLoop === undefined) this.loop();
  }
  pause() {
    this.freeze = !this.freeze;
  }
  loop() {
    this.gameLoop = setInterval(() => {
      if (!this.freeze) {
        this.boardService.clearShape(this.shapeService.getShape());
        this.goDown();
        this.boardService.drawShape(this.shapeService.getShape());
      }
    }, 1000);
  }

  goDown() {
    const position = this.boardService.getPosition();
    if (this.checkColision(position.y + 1, position.x)) {
      this.checkGameOver();
      this.mergeShapeIntoBoard();
      this.cleanRow();
      position.y = 0;
      this.shapeService.changeShape();
    } else {
      this.updatePosition(position.y + 1, position.x);
    }
  }

  checkColision(newY: number, newX: number) {
    let hasColision = false;
    const board = this.boardService.getBoard();
    const shape: number[][] = this.shapeService.getShape();
    for (let y = 0; y < shape.length; y++) {
      if (board[newY + y] === undefined) {
        hasColision = true;
      } else {
        for (let x = 0; x < shape[y].length; x++) {
          if (board[newY + y][newX + x] !== 0) {
            hasColision = true;
          }
        }
      }
    }

    return hasColision;
  }

  checkGameOver(): boolean {
    const shape = this.shapeService.getShape();
    const board = this.boardService.getBoard();
    this.boardService.drawShape(shape);
    const end = board[0].some((cell) => cell === 1);
    if (end) this.stopGame();
    this.boardService.clearShape(shape);
    return end;
  }

  updatePosition(newY: number, newX: number) {
    const position = this.boardService.getPosition();
    if (this.checkColision(newY, newX)) {
      console.log('Colision con algo al decender.');
      console.log('Se procede a unificar tabledo y figura.');
      this.mergeShapeIntoBoard();
      position.y = 0;
      this.shapeService.changeShape();
    } else {
      position.y = newY;
      position.x = newX;
    }
  }

  mergeShapeIntoBoard() {
    const shape = this.shapeService.getShape();
    this.boardService.drawShape(shape);
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
    let shape = this.shapeService.getShape();
    const position = this.boardService.getPosition();
    switch (event.key) {
      case 'ArrowUp': {
        this.boardService.clearShape(shape);
        const newShape = shape[0].map((val, index) =>
          shape.map((row) => row[index])
        );
        shape =
          this.shiftPressed && this.arrowUpPressed
            ? newShape
            : newShape.reverse();
        this.boardService.drawShape(shape);
        break;
      }
      case 'ArrowRight': {
        this.boardService.clearShape(shape);
        if (!this.checkColision(position.y, position.x + 1))
          this.updatePosition(position.y, position.x + 1);
        this.boardService.drawShape(shape);
        break;
      }
      case 'ArrowLeft': {
        this.boardService.clearShape(shape);
        if (!this.checkColision(position.y, position.x - 1))
          this.updatePosition(position.y, position.x - 1);
        this.boardService.drawShape(shape);
        break;
      }
      case 'ArrowDown': {
        this.boardService.clearShape(shape);
        this.updatePosition(position.y + 1, position.x);
        this.boardService.drawShape(shape);
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
    const board = this.boardService.getBoard();
    for (let i = board.length - 1; i > 0; i--) {
      if (board[i].every((cell) => cell === 1)) {
        board.splice(i, 1);
        rowsCleaned++;
      }
    }
    for (let i = 0; i < rowsCleaned; i++) {
      board.unshift(Array.from({ length: this.width }, () => 0));
    }
  }
}
