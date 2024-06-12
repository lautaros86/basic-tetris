import { Injectable } from '@angular/core';
import { ShapeService } from './shape.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board: number[][] = Array<number[]>();

  position: { x: number; y: number } = { x: 5, y: 0 };

  constructor(private shapeService: ShapeService) {}

  initBoard(height: number, width: number) {
    this.board = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => 0)
    );
    this.position = { x: 5, y: 0 };
  }
  getBoard() {
    return this.board;
  }
  getPosition() {
    return this.position;
  }

  drawShape(shape: number[][]) {
    if (shape === undefined) {
      console.log('Intenta dibujar un shape undefined');
    }
    for (let y = 0; y < shape.length; y++) {
      if (shape[y] === undefined) {
        console.log('Intenta dibujar un shape undefined dentro del for');
      }
      for (let x = 0; x < shape[y].length; x++) {
        this.board[this.position.y + y][this.position.x + x] = shape[y][x];
      }
    }
  }

  clearShape(shape: number[][]) {
    if (shape === undefined) {
      console.log('intenta borrar un shape undefined');
    }
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y] === undefined) {
          console.log('Intenta borrar un shape undefined dentro del for');
        }
        this.board[this.position.y + y][this.position.x + x] = 0;
      }
    }
  }
}
