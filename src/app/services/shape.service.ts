import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShapeService {
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

  constructor() {}

  getShape(): number[][] {
    return this.shape;
  }

  changeShape(): void {
    const keys = Object.keys(this.shapes);
    const min = Math.ceil(0);
    const max = Math.floor(keys.length - 1);
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    const key = keys[random];
    if (this.shapes[key] === undefined) {
      console.log('La seleccion de shape es undefined');
    }
    this.shape = this.nextShape;
    this.nextShape = this.shapes[key];
  }
}
