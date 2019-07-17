const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const resolution = 10;
canvas.width = 900;
canvas.height = 900;
const columns = canvas.width / resolution;
const rows = canvas.height / resolution;

// creating grid with nulls
function buildGrid() {
  return new Array(columns).fill(null).map(
    () => new Array(rows).fill(null).map(() => Math.floor(Math.random() * 2)) // randoml "living" cells
  );
}
// function which render our grid and canvas-cell
function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? "black" : "white"; // if cell is true black/white
      ctx.fill();
      // ctx.stroke();
    }
  }
}

let grid = buildGrid();
requestAnimationFrame(update);
function update() {
  grid = nextGenerationsCells(grid);
  render(grid);
  requestAnimationFrame(update);
}

// copy of a grid with a rules
function nextGenerationsCells(grid) {
  const nextGenerationsCells = grid.map(arr => [...arr]);
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        // checking neighbours
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          // handling edges
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < columns && y_cell < rows) {
            const currentNeighbour = grid[col + i][row + j];
            numNeighbours += currentNeighbour;
          }
        }
      }
      //
      if (cell === 1 && numNeighbours < 2) {
        nextGenerationsCells[col][row] = 0;
        // if cell has less than 2 neighbours dies by underpopulation
      } else if (cell === 1 && numNeighbours > 3) {
        // cell die by overpopulation
        nextGenerationsCells[col][row] = 0;
      } else if (cell === 0 && numNeighbours === 3) {
        // if cell has three neighbours alive by reproduction
        nextGenerationsCells[col][row] = 1;
      }
    }
  }
  return nextGenerationsCells;
}
console.log(grid);
