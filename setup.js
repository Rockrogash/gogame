let grid;
let resolution;
let cols;
let rows;

let whiteGroups;
let blackGroups;

let groups;
let groupsTemp
let group;

let mousePos;
let player;

const Players = {WHITE:0, BLACK:1};
const neighbors = [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}];


function setup() {


  createCanvas(900,900);
  resolution = 100;
  cols = width/resolution;
  rows = height/resolution;
  grid = create2DArray(cols, rows);
  player = Players.WHITE;
  whiteGroups = [];
  blackGroups = [];
  groups = [whiteGroups, blackGroups];
}



function draw() {
  background(94, 253, 173);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      let x = i*resolution;
      let y = j*resolution;
      noStroke();
      if (grid[i][j] == 1) {
        fill(31, 26, 56);
        circle(x+(resolution/2), y+(resolution/2), resolution*0.9);
      }
      else if (grid[i][j] == 0) {
        stroke(31, 26, 56);
        fill(231, 238, 236);
        circle(x+(resolution/2), y+(resolution/2), resolution*0.9);
      }
    }
  }

}


function create2DArray(cols, rows){
  let arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}


function formGroups (group, player) {

  groups[player].push(group);
  let vector = group.stones[group.stones.length - 1];

  for (let i = 0; i < groups[player].length - 1; i++) {
    for (let j = 0; j < groups[player][i].stones.length; j++) {
      if((((abs(groups[player][i].stones[j].x - vector.x) == 1) && ((groups[player][i].stones[j].y - vector.y) == 0 )) || ((abs(groups[player][i].stones[j].y - vector.y) == 1 ) && ((groups[player][i].stones[j].x - vector.x) == 0 )))) {
        let newGroup = new Group(concat(groups[player][i].stones, group.stones));
        groups[player].splice(i, 1);
        groups[player].pop();
        return formGroups (newGroup, player);
      }
    }
  }
}


function mouseClicked () {
  //Determine Mouse Position
  mousePos = {x: (round(map(mouseX, 0, width, -0.5, 8.5))), y: (round(map(mouseY, 0, height, -0.5, 8.5)))};
  console.log(mousePos);

  //Check if Mouse is on the Playing Field
  if (mousePos.x >= 0 && mousePos.x <= 8 && mousePos.y >= 0 && mousePos.y <= 8){

    //Check if field is empty
    if (grid[mousePos.x][mousePos.y] == null) {

      let groupsTemp = groups;
      let validMove = true;

      grid[mousePos.x][mousePos.y] = player;
      let newGroup = new Group([{x: mousePos.x, y : mousePos.y}]);
      formGroups(newGroup, player);

      for (var i = 0; i < whiteGroups.length; i++) {
        whiteGroups[i].calcLiberties();
        //console.log("white group " + (i+1) + ": " + whiteGroups[i].liberties.length + " liberties");
      }

      for (var i = 0; i < blackGroups.length; i++) {
        blackGroups[i].calcLiberties();
        //console.log("black group " + (i+1) + ": " + blackGroups[i].liberties.length + " liberties");
      }


      //Check if liberties of new Group are 0
      //console.log(groups[player][groups[player].length - 1].liberties.length);
      if (groups[player][groups[player].length - 1].liberties.length == 0) {
        let killCount = 0;

        //Check if liberties in any group of other player are 0
        //Loop backwards to avoid skipping over indices because of using splice()
        for (var i = groups[switchPlayer(player)].length - 1; i >= 0 ; i--) {
          console.log(i);
          console.log(groups[switchPlayer(player)][i].liberties);
          if (groups[switchPlayer(player)][i].liberties.length == 0) {
            //If they are, increment killCount
            killCount++;

            //Reset grid for that group
            for (var j = 0; j < groups[switchPlayer(player)][i].stones.length; j++) {

              grid[groups[switchPlayer(player)][i].stones[j].x][groups[switchPlayer(player)][i].stones[j].y] = null;
            }

            //Remove that group from groups
            groups[switchPlayer(player)].splice(i, 1);
          }
        }

        //Check if no groups have been killed, if so the move was not valid
        if (killCount == 0) {
          validMove = false;
        }

        //Otherwise calculate Liberties of other player
        else {
          for (var i = 0; i < groups[player].length; i++) {
            groups[player][i].calcLiberties();
          }
        }

      }

      else {
        //Check if liberties in any group of other player are 0
        //Loop backwards to avoid skipping over indices because of using splice()
        if (groups[switchPlayer(player)].length) {
          for (var i = groups[switchPlayer(player)].length - 1; i >= 0 ; i--) {
            if (groups[switchPlayer(player)][i].liberties.length == 0) {
              //Reset grid for that group
              for (var j = 0; j < groups[switchPlayer(player)][i].stones.length; j++) {
                grid[groups[switchPlayer(player)][i].stones[j].x][groups[switchPlayer(player)][i].stones[j].y] = null;
              }

              //Remove that group from groups
              groups[switchPlayer(player)].splice(i, 1);
            }
          }
        }

        for (var i = 0; i < groups[player].length; i++) {
          groups[player][i].calcLiberties();
        }
      }


      //If the move was valid, other players' move
      if (validMove) {
        player = switchPlayer(player);
      }

      //Else, reset state of game before the move
      else {
        groups = groupsTemp;
        grid[mousePos.x][mousePos.y] = null;
      }
    }
  }
}




function switchPlayer (player) {
  return abs(player - 1);
}


function inBounds (i, j, stone) {
  return (((-1 < (stone.x + i)) && ((stone.x + i) < 9)) && ((-1 < (stone.y + j)) && ((stone.y + j) < 9)));
}
