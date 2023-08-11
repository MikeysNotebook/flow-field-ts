declare class Vector {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    toString(): string;
    equals(other: Vector): boolean;
    add(other: Vector): Vector;
    static readonly Zero: Vector;
    static readonly Up: Vector;
    static readonly UpLeft: Vector;
    static readonly UpRight: Vector;
    static readonly Down: Vector;
    static readonly DownLeft: Vector;
    static readonly DownRight: Vector;
    static readonly Left: Vector;
    static readonly Right: Vector;
    static readonly AllDirections: readonly [Vector, Vector, Vector, Vector, Vector, Vector, Vector, Vector];
}
export declare function vec(x: number, y: number): Vector;
export default Vector;
