import InitialGrid from './flow-field/models/Grid';
import { vec } from './flow-field/models/Vector';

const g = new InitialGrid(vec(10, 10));
const cg = g.toCostGrid(vec(0,9), 1, [[vec(2, 3), 255], [vec(1, 3), 255]]);
const ig = cg.toIntegrationGrid();

g.print();
console.log('\n--------------------------------------------\n\n');
cg.print();
console.log('\n--------------------------------------------\n\n');
ig.print();
console.log('\n--------------------------------------------\n\n');
ig.printDirectionGraphic();
