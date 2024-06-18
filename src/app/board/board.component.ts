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
export class BoardComponent {
  @Input() width: number = 0;
  @Input() height: number = 0;

  gameLoop: any;
  freeze: boolean = false;

  shiftPressed = false;
  arrowUpPressed = false;
  lineasEliminadas: number = 0;
  speed = 1000;

  board: number[][] = [];
  preBoard: number[][] = [];

  gameOver: boolean = false;
  constructor(
    private shapeService: ShapeService,
    private boardService: BoardService
  ) {}

  start() {
    this.gameOver = false;
    this.boardService.initBoard(this.height, this.width);
    this.board = this.boardService.getBoard();
    this.preBoard = this.boardService.getPreBoard();
    this.shapeService.changeShape();
    this.shapeService.changeShape();
    this.boardService.drawShape();
    this.freeze = false;
    if (this.gameLoop === undefined) this.loop();
  }

  pause() {
    this.freeze = !this.freeze;
  }

  loop() {
    this.gameLoop = setInterval(() => {
      if (!this.freeze) {
        this.boardService.clearShape();
        this.goDown();
        this.lineasEliminadas = this.boardService.rowsDeleted;
        this.incressSpeed();
        this.boardService.drawShape();
        this.board = this.boardService.getBoard();
      }
    }, this.speed);
  }

  incressSpeed() {
    if (this.boardService.speedIncreaseTimes > 0) {
      clearInterval(this.gameLoop);
      const incressSpeedFlag = this.boardService.speedIncreaseTimes;
      for (let i = 0; i < incressSpeedFlag; i++) {
        this.speed = this.speed - this.speed * 0.25;
      }
      this.boardService.speedIncreaseTimes = 0;
      this.loop();
    }
  }

  goDown() {
    const position = this.boardService.getPosition();
    if (this.checkColision(position.y + 1, position.x)) {
      this.checkGameOver();
      this.boardService.mergeShapeIntoBoard();
      this.boardService.cleanRow();
      position.y = 0;
      position.x = 5;
      this.shapeService.changeShape();
    } else {
      this.boardService.setPosition(position.y + 1, position.x);
    }
  }

  checkColision(
    newY: number,
    newX: number,
    shape: number[][] = this.shapeService.getShape()
  ) {
    let hasColision = false;
    const board = this.boardService.getBoard();
    shape.forEach((row, y) => {
      if (board[newY + y] === undefined) {
        hasColision = true;
      } else {
        row.forEach((value, x) => {
          if (board[newY + y][newX + x] !== 0 && shape[y][x] === 1) {
            hasColision = true;
          }
        });
      }
    });

    return hasColision;
  }

  // returns true if detect a colition
  checkShapeRotation(shape: number[][]): boolean {
    let hasColision = false;
    const board = this.boardService.getBoard();
    const position = this.boardService.getPosition();
    for (let y = position.y; y < shape.length; y++) {
      if (board[y] === undefined) {
        hasColision = true;
      } else {
        for (let x = position.x; x < shape[y].length; x++) {
          if (board[y][x] !== 0) {
            hasColision = true;
          }
        }
      }
    }
    return hasColision;
  }

  checkGameOver(): boolean {
    const board = this.boardService.getBoard();
    this.boardService.drawShape();
    const end = board[0].some((cell) => cell === 1);
    if (end) this.stopGame();
    this.boardService.clearShape();
    return end;
  }

  stopGame() {
    this.boardService.setBoard([]);
    this.gameOver = true;
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
    let shape = this.shapeService.getShape();
    const position = this.boardService.getPosition();
    switch (event.key) {
      case 'ArrowUp': {
        const rotatedShape = shape[0].map((_, index) =>
          shape.map((row) => row[index])
        );
        this.boardService.clearShape();
        if (!this.checkColision(position.y, position.x, rotatedShape)) {
          shape =
            this.shiftPressed && this.arrowUpPressed
              ? rotatedShape
              : rotatedShape.reverse();
          this.shapeService.setShape(shape);
          this.boardService.drawShape();
        }
        break;
      }
      case 'ArrowRight': {
        this.boardService.clearShape();
        if (!this.checkColision(position.y, position.x + 1))
          this.boardService.setPosition(position.y, position.x + 1);
        this.boardService.drawShape();
        break;
      }
      case 'ArrowLeft': {
        this.boardService.clearShape();
        if (!this.checkColision(position.y, position.x - 1))
          this.boardService.setPosition(position.y, position.x - 1);
        this.boardService.drawShape();
        break;
      }
      case 'ArrowDown': {
        this.boardService.clearShape();
        if (!this.checkColision(position.y + 1, position.x))
          this.boardService.setPosition(position.y + 1, position.x);
        this.boardService.drawShape();
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }
}
