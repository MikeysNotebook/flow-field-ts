import GridCell from './GridCell';
import Vector from './Vector';
declare abstract class BaseGrid {
    protected cellCache: Map<string, GridCell>;
    getCells(): IterableIterator<GridCell>;
    getCell(position: Vector): GridCell | undefined;
    print(): void;
}
declare class InitialGrid extends BaseGrid {
    readonly gridDimensions: Vector;
    constructor(gridDimensions: Vector);
    clone(): InitialGrid;
    toCostGrid(destinationVector: Vector, defaultCost: number, weightedCells: [Vector, number][]): CostGrid;
}
export declare class CostGrid extends BaseGrid {
    readonly grid: InitialGrid;
    defaultCost: number;
    destinationVector: Vector;
    readonly weightedVectors: [Vector, number][];
    static readonly WALL_VALUE = 255;
    constructor(grid: InitialGrid, defaultCost: number, destinationVector: Vector, weightedVectors: [Vector, number][]);
    private setCosts;
    toIntegrationGrid(): IntegrationGrid;
}
export declare class IntegrationGrid extends BaseGrid {
    readonly costGrid: CostGrid;
    static readonly MAX_VALUE = 9999;
    constructor(costGrid: CostGrid);
    private defaultArray;
    private isNotWall;
    getNeighbors4(position: Vector): GridCell[];
    getLowestDirection(position: Vector): Vector;
    runIntegrationFunction(): void;
    calculateDirections(): void;
    printDirectionGraphic(): void;
}
export default InitialGrid;
