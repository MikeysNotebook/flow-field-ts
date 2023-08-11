import Vector from './Vector';
declare class GridCell {
    readonly position: Vector;
    value: number;
    readonly key: string;
    direction: Vector;
    constructor(position: Vector, value: number);
    toString(): string;
    clone(nuValue?: number): GridCell;
}
export default GridCell;
