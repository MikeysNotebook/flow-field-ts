var D = Object.defineProperty;
var A = (a, i, t) => i in a ? D(a, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[i] = t;
var o = (a, i, t) => (A(a, typeof i != "symbol" ? i + "" : i, t), t);
const n = class n {
  constructor(i, t) {
    o(this, "x");
    o(this, "y");
    this.x = i, this.y = t;
  }
  toString() {
    return `Vector(${this.x}, ${this.y})`;
  }
  equals(i) {
    return this.x === i.x && this.y === i.y;
  }
  add(i) {
    return new n(this.x + i.x, this.y + i.y);
  }
};
o(n, "Zero", new n(0, 0)), o(n, "Up", new n(0, -1)), o(n, "UpLeft", new n(-1, -1)), o(n, "UpRight", new n(1, -1)), o(n, "Down", new n(0, 1)), o(n, "DownLeft", new n(-1, 1)), o(n, "DownRight", new n(1, 1)), o(n, "Left", new n(-1, 0)), o(n, "Right", new n(1, 0)), o(n, "AllDirections", [
  n.Up,
  n.UpLeft,
  n.UpRight,
  n.Down,
  n.DownLeft,
  n.DownRight,
  n.Left,
  n.Right
]);
let l = n;
function h(a, i) {
  return new l(a, i);
}
class C {
  constructor(i, t) {
    o(this, "position");
    o(this, "value");
    o(this, "key");
    o(this, "direction");
    this.position = i, this.value = t, this.key = this.toString(), this.direction = l.Zero;
  }
  toString() {
    return `${this.position.toString()} = ${this.value}`;
  }
  clone(i = this.value) {
    return new C(this.position, i);
  }
}
class p {
  constructor() {
    o(this, "cellCache", /* @__PURE__ */ new Map());
  }
  getCells() {
    return this.cellCache.values();
  }
  getCell(i) {
    return this.cellCache.get(i.toString());
  }
  print() {
    let i = "", t = 0;
    for (let e of this.getCells())
      e.position.y !== t && (console.log(i), i = "", t = e.position.y), i += `${e.toString()} |`;
    console.log(i);
  }
}
class v extends p {
  constructor(t) {
    super();
    o(this, "gridDimensions");
    this.gridDimensions = t;
    for (let e = 0; e < t.y; e++)
      for (let s = 0; s < t.x; s++) {
        const r = h(s, e), c = new C(r, -1);
        this.cellCache.set(r.toString(), c);
      }
  }
  clone() {
    return new v(this.gridDimensions);
  }
  toCostGrid(t, e, s) {
    return new y(this, e, t, s);
  }
}
class y extends p {
  constructor(t, e, s, r) {
    super();
    o(this, "grid");
    o(this, "defaultCost");
    o(this, "destinationVector");
    o(this, "weightedVectors");
    this.grid = t, this.defaultCost = e, this.destinationVector = s, this.weightedVectors = r, this.setCosts();
  }
  setCosts() {
    for (let t of this.grid.getCells()) {
      let e = this.weightedVectors.find((r) => r[0].equals(t.position)), s = this.defaultCost;
      if (t.position.equals(this.destinationVector))
        s = 0;
      else if (e) {
        const [r, c] = e;
        s = c;
      }
      this.cellCache.set(t.position.toString(), t.clone(s));
    }
  }
  toIntegrationGrid() {
    const t = this;
    return new w(t);
  }
}
o(y, "WALL_VALUE", 255);
const u = class u extends p {
  constructor(t) {
    super();
    o(this, "costGrid");
    this.costGrid = t, this.defaultArray(), this.runIntegrationFunction(), this.calculateDirections();
  }
  defaultArray() {
    for (let t of this.costGrid.getCells())
      this.cellCache.set(t.position.toString(), t.clone(u.MAX_VALUE));
  }
  isNotWall(t) {
    var e;
    return ((e = this.costGrid.getCell(t.position)) == null ? void 0 : e.value) !== y.WALL_VALUE;
  }
  getNeighbors4(t) {
    const e = this;
    return [
      e.getCell(h(t.x, t.y - 1)),
      e.getCell(h(t.x, t.y + 1)),
      e.getCell(h(t.x - 1, t.y)),
      e.getCell(h(t.x + 1, t.y))
    ].filter((s) => s !== void 0 && e.isNotWall(s));
  }
  getLowestDirection(t) {
    const e = this, s = e.getCell(t);
    return (s == null ? void 0 : s.value) === u.MAX_VALUE ? l.Zero : l.AllDirections.reduce((c, g) => {
      const [d, L] = c, x = t.add(g), f = e.getCell(x);
      return f && f.value < d ? [f.value, g] : c;
    }, [256, h(0, 0)])[1];
  }
  runIntegrationFunction() {
    const t = [], e = this.getCell(this.costGrid.destinationVector);
    for (e.value = 0, t.push(e); t.length > 0; ) {
      const s = t.pop();
      if (!s)
        continue;
      const r = this.getNeighbors4(s.position);
      for (let c = 0; c < r.length; c++) {
        const g = this.costGrid.getCell(r[c].position);
        let d = s.value + g.value;
        d < r[c].value && (t.some((L) => L === r[c]) || t.push(r[c]), r[c].value = d);
      }
    }
  }
  calculateDirections() {
    for (let t of this.getCells())
      t.position.equals(this.costGrid.destinationVector) ? t.direction = l.Zero : t.direction = this.getLowestDirection(t.position);
  }
  printDirectionGraphic() {
    const t = [];
    for (let e of this.getCells()) {
      const s = e.position.y;
      switch (t[s] || (t[s] = ""), !0) {
        case l.Up.equals(e.direction):
        case l.Down.equals(e.direction):
          t[s] += " | ";
          break;
        case l.Left.equals(e.direction):
        case l.Right.equals(e.direction):
          t[s] += " - ";
          break;
        case l.UpLeft.equals(e.direction):
        case l.DownRight.equals(e.direction):
          t[s] += " \\ ";
          break;
        case l.UpRight.equals(e.direction):
        case l.DownLeft.equals(e.direction):
          t[s] += " / ";
          break;
        case l.Zero.equals(e.direction):
          t[s] += " o ";
      }
    }
    console.log(t.join(`
`));
  }
};
o(u, "MAX_VALUE", 9999);
let w = u;
export {
  y as CostGrid,
  C as GridCell,
  v as InitialGrid,
  w as IntegrationGrid,
  l as Vector,
  h as vec
};
