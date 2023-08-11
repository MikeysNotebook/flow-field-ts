class Vector {
    constructor(public readonly x: number, public readonly y: number) {}
    
    toString() {
        return `Vector(${this.x}, ${this.y})`;
    }
    
    equals(other: Vector) {
        return this.x === other.x && this.y === other.y;
    }
    
    add (other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
    
    public static readonly Zero     = new Vector(0, 0);

    public static readonly Up       = new Vector(0, -1);
    public static readonly UpLeft       = new Vector(-1, -1);
    public static readonly UpRight= new Vector(1, -1);

    public static readonly Down     = new Vector(0, 1);
    public static readonly DownLeft     = new Vector(-1, 1);
    public static readonly DownRight    = new Vector(1, 1);
    
    
    public static readonly Left     = new Vector(-1, 0);
    public static readonly Right    = new Vector(1, 0);
    
    public static readonly AllDirections = [
        this.Up,
        this.UpLeft,
        this.UpRight,

        this.Down,
        this.DownLeft,
        this.DownRight,
        
        this.Left,
        this.Right,
    ] as const;
}

export function vec(x: number, y: number) {
    return new Vector(x, y);
}

export default Vector;