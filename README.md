# Flow Field

Implements a flow field using typescript.

# Installation

```bash
npm i flow-field-ts
```

# Usage

## 1. Create an InitialGrid

This is the first structure to create that represents the entire grid area.

```typescript
const grid = new InitialGrid(vec(10, 10));
```

## 2. Convert to CostGrid

The next step is to convert to a `CostGrid` by providing the destination vector, the initial cost value, and a tuple array of vectors that have different weights.


```typescript
const costGrid = g.toCostGrid(ffVec(9, 9), 1, []);
```

## 3. Convert to IntegrationGrid

The final step to to convert to `IntegrationGrid` which will create the destination vector of each `GridCell`.

```typescript
const iGrid = costGrid.toIntegrationGrid();
```

The integration grid is what you will use to determine the flow of entities.


# Example

```typescript
// Using ExcaliburJs to demo game loop
import { Actor, CollisionType, Color, Engine, Vector, vec } from 'excalibur'
import { InitialGrid, vec as ffVec } from 'flow-field-ts'

/**
 *  Grid can represent any dimensions.  It's best not to represent 1 pixel.
 * In this case, 1x1 grid square represent 60 width and 80 height
 **/
const WIDTH = 800;
const HEIGHT = 600;

const xGridLength = 10;
const yGridLength = 10;

const xCellWidth = WIDTH / xGridLength;
const yCellHeight = HEIGHT / yGridLength;
const SPEED = 30;

const g = new InitialGrid(ffVec(10, 10));
const cg = g.toCostGrid(ffVec(9, 9), 1, []);
const ig = cg.toIntegrationGrid();

const game = new Engine({
    width: WIDTH,
    height: HEIGHT,
});

game.start().then(() => {
    // generating 1000 actors
    for (let i = 0; i < 1000; i++) {
        // Create random location for actor to spawn
        const randomX = Math.trunc(Math.random() * WIDTH);
        const randomY = Math.trunc(Math.random() * HEIGHT);

        const actor = new Actor({
            x: randomX,
            y: randomY,
            width: 2,
            height: 2,
            color: Color.Black,
            collisionType: CollisionType.Active
        });
        
        // Calculate velocity in update loop
        actor.on('postupdate', () => {
            // Here is where the actor position is converted to GridCell
            const xCellValue = Math.trunc(actor.pos.x / xCellWidth);
            const yCellValue = Math.trunc(actor.pos.y / yCellHeight);
            const gridCell = ig.getCell(ffVec(xCellValue, yCellValue));
            
            if (gridCell) {
                // Sets velocity to move actor
                actor.vel = vec(gridCell.direction.x * SPEED, gridCell.direction.y * SPEED);
            }
            
            if (actor.vel.equals(Vector.Zero)) {
                // kill if reaches destination
                setTimeout(() => {
                    actor.kill();
                }, 300);
            }
        });
        game.add(actor);
    }
});

```

![Demo.gif](https://github.com/MikeysNotebook/flow-field-ts/blob/main/public/demo.gif?raw=true)
