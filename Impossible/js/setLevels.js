const setLevel1 = function() {
  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      const cell = cells[x][y];
      if (y < 4 || y > 10 || x < 2 || x > 17) {
        cell.wall = true;
      } else if (x < 5) {
        cell.start = true;
      } else if (x > 14) {
        cell.goal = true;
      }
    }
  }
  
  cells[2][4].wall = true;
  cells[2][5].wall = true;
  cells[2][6].wall = true;
  cells[2][7].wall = true;
  cells[2][8].wall = true;
  
  cells[3][4].wall = true;
  cells[3][5].wall = true;
  cells[3][6].wall = true;
  cells[3][7].wall = true;
  cells[3][8].wall = true;

  cells[4][4].wall = true;
  cells[4][5].wall = true;
  cells[4][6].wall = true;
  cells[4][7].wall = true;
  cells[4][8].wall = true;

  // left vertical wall
  cells[5][4].wall = true;
  cells[5][5].wall = true;
  cells[5][6].wall = true;
  cells[5][7].wall = true;
  cells[5][8].wall = true;
  cells[5][9].wall = true;

  // top horizontal wall
  cells[6][4].wall = true;
  cells[7][4].wall = true;
  cells[8][4].wall = true;
  cells[9][4].wall = true;
  cells[10][4].wall = true;
  cells[11][4].wall = true;
  cells[12][4].wall = true;

  // right vertical wall
  cells[14][5].wall = true;
  cells[14][6].wall = true;
  cells[14][7].wall = true;
  cells[14][8].wall = true;
  cells[14][9].wall = true;
  cells[14][10].wall = true;

  // bottom horizontal wall
  cells[7][10].wall = true;
  cells[8][10].wall = true;
  cells[9][10].wall = true;
  cells[10][10].wall = true;
  cells[11][10].wall = true;
  cells[12][10].wall = true;
  cells[13][10].wall = true;

  balls.push(
    new Ball(cells[6][5], ballDiameter, createVector(ballVelocity,0)),
    new Ball(cells[13][6], ballDiameter, createVector(-ballVelocity,0)),
    new Ball(cells[6][7], ballDiameter, createVector(ballVelocity,0)),
    new Ball(cells[13][8], ballDiameter, createVector(-ballVelocity,0)),
    new Ball(cells[6][9], ballDiameter, createVector(ballVelocity,0)),
  );

  return [cells[15][4]];
};

const setLevel2 = function() {
   coinsNeeded = 6;
   coinsCollected = 0;

  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      const cell = cells[x][y];
      if (y < 3 || y > 11 || x < 2 || x > 17) {
        cell.wall = true;
      } else if (x < 4) {
        cell.start = true;
      } else if (x > 15) {
        cell.goal = true;
      }
    }
  }

  // left vertical wall
  cells[4][3].wall = true;
  cells[4][4].wall = true;
  cells[4][5].wall = true;
  cells[4][6].wall = true;
  cells[4][8].wall = true;
  cells[4][9].wall = true;
  cells[4][10].wall = true;
  cells[4][11].wall = true;

  // top horizontal wall
  cells[5][3].wall = true;
  cells[6][3].wall = true;
  cells[7][3].wall = true;
  cells[8][3].wall = true;
  cells[9][3].wall = true;
  cells[10][3].wall = true;
  cells[11][3].wall = true;
  cells[12][3].wall = true;
  cells[13][3].wall = true;
  cells[14][3].wall = true;

  // right vertical wall
  cells[15][3].wall = true;
  cells[15][4].wall = true;
  cells[15][5].wall = true;
  cells[15][6].wall = true;
  cells[15][8].wall = true;
  cells[15][9].wall = true;
  cells[15][10].wall = true;
  cells[15][11].wall = true;

  // bottom horizontal wall
  cells[5][11].wall = true;
  cells[6][11].wall = true;
  cells[7][11].wall = true;
  cells[8][11].wall = true;
  cells[9][11].wall = true;
  cells[10][11].wall = true;
  cells[11][11].wall = true;
  cells[12][11].wall = true;
  cells[13][11].wall = true;
  cells[14][11].wall = true;

  balls.push(
    new Ball(cells[5][4], ballDiameter, createVector(0,ballVelocity)),
    new Ball(cells[6][10], ballDiameter, createVector(0,-ballVelocity)),
    new Ball(cells[7][4], ballDiameter, createVector(0,ballVelocity)),
    new Ball(cells[8][10], ballDiameter, createVector(0,-ballVelocity)),
    new Ball(cells[9][4], ballDiameter, createVector(0,ballVelocity)),
    new Ball(cells[10][10], ballDiameter, createVector(0,-ballVelocity)),
    new Ball(cells[11][4], ballDiameter, createVector(0,ballVelocity)),
    new Ball(cells[12][10], ballDiameter, createVector(0,-ballVelocity)),
    new Ball(cells[13][4], ballDiameter, createVector(0,ballVelocity)),
    new Ball(cells[14][10], ballDiameter, createVector(0,-ballVelocity)),
  );

  coins.push(
      new Coin(cells[9][6], coinDiameter),
      new Coin(cells[9][7], coinDiameter),
      new Coin(cells[9][8], coinDiameter),
      new Coin(cells[10][6], coinDiameter),
      new Coin(cells[10][7], coinDiameter),
      new Coin(cells[10][8], coinDiameter)
  );

  return [cells[16][7]];
};

const setLevel3 = function() {
  coinsNeeded = 4;
  coinsCollected = 0;

  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      const cell = cells[x][y];
      if (x < 6 || x > 13 || y < 3 || y > 9) {
        cell.wall = true;
      } else if (x > 7 && x < 12 && y > 4 && y < 8) {
        cell.start = true;
        cell.goal = true;
      }
    }
  }

  //safe zones
  cells[8][2].wall = false;
  cells[14][4].wall = false;
  cells[5][8].wall = false;
  cells[11][10].wall = false;

  //top border
  cells[7][4].wall = true;
  cells[8][4].wall = true;
  cells[9][4].wall = true;
  cells[10][4].wall = true;
  cells[11][4].wall = true;
  cells[12][4].wall = true;
  cells[7][5].wall = true;
  cells[12][5].wall = true;

  //bottom border
  cells[7][8].wall = true;
  cells[8][8].wall = true;
  cells[9][8].wall = true;
  cells[10][8].wall = true;
  cells[11][8].wall = true;
  cells[12][8].wall = true;
  cells[7][7].wall = true;
  cells[12][7].wall = true;

  balls.push(
      new Ball(cells[13][4], ballDiameter, createVector(0,ballVelocity)),
      new Ball(cells[13][5], ballDiameter, createVector(0,ballVelocity)),
      new Ball(cells[13][6], ballDiameter, createVector(0,ballVelocity)),
      new Ball(cells[13][7], ballDiameter, createVector(0,ballVelocity)),
      new Ball(cells[13][8], ballDiameter, createVector(0,ballVelocity)),
      new Ball(cells[13][9], ballDiameter, createVector(-ballVelocity,0)),
      new Ball(cells[12][9], ballDiameter, createVector(-ballVelocity,0)),
      new Ball(cells[11][9], ballDiameter, createVector(-ballVelocity,0)),
      new Ball(cells[10][9], ballDiameter, createVector(-ballVelocity,0)),
      new Ball(cells[9][9], ballDiameter, createVector(-ballVelocity,0)),

      new Ball(cells[6][3], ballDiameter, createVector(0,-ballVelocity)),
      new Ball(cells[6][4], ballDiameter, createVector(0,-ballVelocity)),
      new Ball(cells[6][5], ballDiameter, createVector(0,-ballVelocity)),
      new Ball(cells[6][6], ballDiameter, createVector(0,-ballVelocity)),
      new Ball(cells[6][7], ballDiameter, createVector(0,-ballVelocity)),
      new Ball(cells[6][8], ballDiameter, createVector(ballVelocity,0)),
      new Ball(cells[7][3], ballDiameter, createVector(ballVelocity,0)),
      new Ball(cells[8][3], ballDiameter, createVector(ballVelocity,0)),
      new Ball(cells[9][3], ballDiameter, createVector(ballVelocity,0)),
      new Ball(cells[10][3], ballDiameter, createVector(ballVelocity,0)),
  );

  coins.push(
      new Coin(cells[8][2], coinDiameter),
      new Coin(cells[14][4], coinDiameter),
      new Coin(cells[5][8], coinDiameter),
      new Coin(cells[11][10], coinDiameter)
  );

  return [cells[11][6], cells[8][6]];
};
