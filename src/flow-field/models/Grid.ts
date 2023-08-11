import GridCell from './GridCell';
import Vector, { vec } from './Vector';

abstract class BaseGrid {
    protected cellCache: Map<string, GridCell> = new Map();
    
    getCells() {
        return this.cellCache.values();
    }

    getCell(position: Vector) {
        let cell = this.cellCache.get(position.toString());
        return cell;
    }

    print() {
        let str = '';
        let lastY = 0;

        for(let cell of this.getCells()) {
            if (cell.position.y !== lastY) {
                console.log(str);
                str = '';
                lastY = cell.position.y;
            }
            
            str += `${cell.toString()} |`;
        }
        
        console.log(str);
    }
}

class InitialGrid extends BaseGrid {
    
    constructor(public readonly gridDimensions: Vector) {
        super();
        for(let y = 0; y < gridDimensions.y; y++) {
            for(let x = 0; x < gridDimensions.x; x++) {
                const pos = vec(x, y);
                const cell = new GridCell(pos, -1);
                this.cellCache.set(pos.toString(), cell);
            }
        }
    }
    
    
    clone() {
        const clone = new InitialGrid(this.gridDimensions);
        return clone;
    }
    
    toCostGrid(destinationVector: Vector, defaultCost: number, weightedCells: [Vector, number][]): CostGrid {
        return new CostGrid(this, defaultCost, destinationVector, weightedCells);
    }
};

export class CostGrid extends BaseGrid {
    
    public static readonly WALL_VALUE = 255;

    constructor(
        public readonly grid: InitialGrid,
        public defaultCost: number,
        public destinationVector: Vector,
        public readonly weightedVectors: [Vector, number][]
    ) {
        super();
        this.setCosts();
    }
    
    private setCosts() {
        for(let cell of this.grid.getCells()) {
            let weightedValue = this.weightedVectors.find(wv => wv[0].equals(cell.position));
            let value = this.defaultCost;
            
            if (cell.position.equals(this.destinationVector)) {
                value = 0;
            } else if(weightedValue) {
                const [_, weight] = weightedValue;
                value = weight;
            }

            this.cellCache.set(cell.position.toString(), cell.clone(value));
        }
    }

    toIntegrationGrid() {
        const me = this;
        return new IntegrationGrid(me);
    }
}

export class IntegrationGrid extends BaseGrid {
    
    static readonly MAX_VALUE = 9999;

    constructor(
        public readonly costGrid: CostGrid,
    ) {
        super();
        this.defaultArray();
        this.runIntegrationFunction();
        this.calculateDirections();
    }
    
    private defaultArray() {
        for(let cell of this.costGrid.getCells()) {
            this.cellCache.set(cell.position.toString(), cell.clone(IntegrationGrid.MAX_VALUE))
        }
    }

    private isNotWall (cell: GridCell) {
        return this.costGrid.getCell(cell.position)?.value !== CostGrid.WALL_VALUE       
    }
    
    
    getNeighbors4(position: Vector): GridCell[] {
        const me = this;
        return [
            me.getCell(vec(position.x, position.y - 1)),
            me.getCell(vec(position.x, position.y + 1)),
            me.getCell(vec(position.x - 1, position.y)),
            me.getCell(vec(position.x + 1, position.y))
        ].filter(n => n !== undefined && me.isNotWall(n)) as GridCell[];
    }

    getLowestDirection(position: Vector): Vector {
        const me = this;
        const cell = me.getCell(position);
        if (cell?.value === IntegrationGrid.MAX_VALUE) {
            return Vector.Zero;
        }
        const r = Vector.AllDirections
            .reduce((tup, currentDirection) => {
                const [value, _direction] = tup;
                const neighborVec = position.add(currentDirection);
                const neighborCell = me.getCell(neighborVec)
                
                if (!neighborCell) return tup;

                if (neighborCell.value < value) {
                    return [neighborCell.value, currentDirection] as [number, Vector];
                }
                
                return tup;
            }, [256, vec(0, 0)] as [number, Vector]);
        return r[1];
    }
    
    runIntegrationFunction() {
        const openList: GridCell[] = [];
        
        const destinationCell = this.getCell(this.costGrid.destinationVector)!;
        destinationCell.value = 0;
        openList.push(destinationCell);
        
        while (openList.length > 0) {
            const current = openList.pop();
            if (!current) continue;
            
            const neighbors = this.getNeighbors4(current.position);
            
            //Iterate through the neighbors of the current node
            for (let i = 0; i < neighbors.length; i++) {
                
                const costCell = this.costGrid.getCell(neighbors[i].position)!;
                
                let endNodeCost = current.value +  costCell.value;
 
                //If a shorter path has been found, add the node into the open list
                if (endNodeCost < neighbors[i].value)
                {
                    //Check if the neighbor cell is already in the list.
                    //If it is not then add it to the end of the list.
                    if (!openList.some(c => c === neighbors[i]))
                    {
                        openList.push(neighbors[i]);
                    }
     
                    //Set the new cost of the neighbor node.
                    neighbors[i].value = endNodeCost;
                }
            }

        }
    }
    
    calculateDirections() {
        for (let cell of this.getCells()) {
            if (cell.position.equals(this.costGrid.destinationVector)) {
                cell.direction = Vector.Zero;
            } else {
                cell.direction = this.getLowestDirection(cell.position);
            }
        }
    }
    
    printDirectionGraphic() {
        const str: string[] = [];

        for (let cell of this.getCells()) {
            const y = cell.position.y;
            if (!str[y]) {
                str[y] = '';
            }
            
            switch(true) {
                case Vector.Up.equals(cell.direction):
                case Vector.Down.equals(cell.direction):
                    str[y] += ' | ';
                    break;
                case Vector.Left.equals(cell.direction):
                case Vector.Right.equals(cell.direction):
                    str[y] += ' - ';
                    break;
                case Vector.UpLeft.equals(cell.direction):
                case Vector.DownRight.equals(cell.direction):
                    str[y] += ' \\ ';
                    break;
                case Vector.UpRight.equals(cell.direction):
                case Vector.DownLeft.equals(cell.direction):
                    str[y] += ' / ';
                    break;
                case Vector.Zero.equals(cell.direction):
                    str[y] += ' o ';

            }
        }
        
        console.log(str.join('\n'));
    }
}


export default InitialGrid;