import Vector from './Vector';

class GridCell {
    public readonly key: string;
    public direction: Vector;
    constructor(public readonly position: Vector, public value: number) {
        this.key = this.toString();
        this.direction = Vector.Zero;
    }
    
    toString() {
        return `${this.position.toString()} = ${this.value}`;
    }
    
    clone(nuValue: number = this.value) {
        return new GridCell(this.position, nuValue);
    }
    
}

export default GridCell;