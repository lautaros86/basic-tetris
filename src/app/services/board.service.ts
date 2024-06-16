import { Injectable } from '@angular/core';
import { ShapeService } from './shape.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  boardTest = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ];
  board: number[][] = Array<number[]>();

  position: { x: number; y: number } = { x: 5, y: 0 };

  constructor(private shapeService: ShapeService) {}

  initBoard(height: number, width: number) {
    // this.board = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
    this.board = this.boardTest;
    this.position = { x: 5, y: 0 };
  }

  getBoard() {
    return [...this.board];
  }
  setBoard(board: number[][]) {
    this.board = board;
  }
  getPosition() {
    return this.position;
  }

  setPosition(y: number, x: number) {
    this.position = { x, y };
  }

  iterateShape(cb: Function) {
    const shape: number[][] = this.shapeService.getShape();
    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        const boardY = this.position.y + y;
        const boardX = this.position.x + x;
        cb(value, boardY, boardX);
      });
    });
  }

  clearShape() {
    const cb = (value: number, y: number, x: number) => {
      if (!!value) this.board[y][x] = 0;
    };
    this.iterateShape(cb);
  }

  drawShape() {
    const cb = (value: number, y: number, x: number) => {
      if (!!value && this.board[y][x] === 0) this.board[y][x] = value;
    };
    this.iterateShape(cb);
  }

  cleanRow() {
    const board = this.getBoard();
    const rowsToDetele: number[] = [];
    this.board.forEach((row, y) => {
      if (row.every((cell) => cell === 1)) {
        rowsToDetele.push(y);
      }
    });
    rowsToDetele
      .reverse()
      .forEach((rowToDelete) => this.board.splice(rowToDelete, 1));
    for (let i = 0; i < rowsToDetele.length; i++) {
      this.board.unshift(Array.from({ length: board.length }, () => 0));
    }
  }

  mergeShapeIntoBoard() {
    this.drawShape();
  }
}
