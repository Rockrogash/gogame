let grid;
let resolution;
let cols;
let rows;

let moves;
let groups;
let groupsTemp;
let group;

let mousePos;
let player;
let size;
let messages;
let canvas;

const Players = {WHITE:0, BLACK:1};
const neighbors = [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}];
const fieldSizes = {SMALL: 9, MIDDLE: 13, BIG: 19};

var hallo = $('canvas-container');


function setup() {

  size = fieldSizes.SMALL;
  canvas = createCanvas(800,800);
  canvas.parent('canvas-container');

  //img1 = loadImage("/assets/background_coffeestain.jpeg");
  img = loadImage('https://images.unsplash.com/photo-1525034687081-c702010cb70d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80');
  resolution = width/size;
  cols = size;
  rows = size;
  grid = create2DArray(cols, rows);
  player = Players.WHITE;
  moves = [];
  groups = [new Array(), new Array()];
  console.log(groups);
  messages = [];
}


function draw() {
  //background(94, 253, 173);
  background(img);

  //Draw Lines
  for (var i = 0; i < cols + 1; i++) {
    let x = i*resolution-resolution/2;
    stroke(0);
    line(x, resolution/2, x, height-resolution/2);
  }

  for (var i = 0; i < rows + 1; i++) {
    let y = i*resolution-resolution/2;
    stroke(0);
    line(resolution/2, y, width-resolution/2, y);
  }


  //Draw Stones
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

  //Show Messages
  for (var i = messages.length - 1; i >= 0; i--) {
    messages[i].show();
    if (messages[i].duration >= 300) {
      messages.splice(i, 1);
    }
  }

  if (moves.length > 0) {

  }

}

// *** Helper Functions *** //

function create2DArray(cols, rows){
  let arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);

    for (var j = 0; j < arr[i].length; j++) {
      arr[i][j] = null;
    }

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
  mousePos = {x: (round(map(mouseX, 0, width, -0.5, size - 0.5))), y: (round(map(mouseY, 0, height, -0.5, size - 0.5)))};
  //Check if Mouse is on the grid
  if (mousePos.x >= 0 && mousePos.x <= (size - 1) && mousePos.y >= 0 && mousePos.y <= (size - 1)){
    //Check if field is empty
    if (grid[mousePos.x][mousePos.y] == null) {

      groupsTemp = _.cloneDeep(groups);
      gridTemp = _.cloneDeep(grid);

      let validMove = true;

      //Place stone and form groups
      grid[mousePos.x][mousePos.y] = player;
      let newGroup = new Group([{x: mousePos.x, y : mousePos.y}]);
      formGroups(newGroup, player);


      //Calculate liberties of all groups
      for (var i = 0; i < groups[0].length; i++) {
        groups[0][i].calcLiberties();
      }

      for (var i = 0; i < groups[1].length; i++) {
        groups[1][i].calcLiberties();
      }


      //Check if liberties of new Group are 0
      if (groups[player][groups[player].length - 1].liberties.length == 0) {
        let killCount = 0;

        //Check if liberties in any group of other player are 0
        for (var i = groups[switchPlayer(player)].length - 1; i >= 0 ; i--) {
          //If they are, increment killCount
          if (groups[switchPlayer(player)][i].liberties.length == 0) {
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

      //Ko' Rule (Same move cannot be done twice in a row)
      if (moves.length > 2){
        if (_.isEqual(grid, moves[moves.length-2].grid)) {
          validMove = false;
        }
      }

      //If the move was valid, save move in moves and switch player
      if (validMove) {
        //let move = [_.cloneDeep(groups), _.cloneDeep(grid)];
        let move = {groups: _.cloneDeep(groups), grid: _.cloneDeep(grid)};
        moves.push(move);

      //Undo Button Logic
      if (moves.length == 1) {
          $('#menu-bar').append('<button id="undo">UNDO</button>');
          $('#undo').click(function(){undo();});
          // listenToUndo();
        }

        player = switchPlayer(player);
      }

      //Else, create Error Message and reset state of game before the move
      else {
        let message = new Message('Move not allowed!');
        messages.push(message);
        groups = _.cloneDeep(groupsTemp);
        grid = _.cloneDeep(gridTemp);
      }
    }
  }
}


function switchPlayer (player) {
  return abs(player - 1);
}


function inBounds (i, j, stone) {
  return (((-1 < (stone.x + i)) && ((stone.x + i) < size)) && ((-1 < (stone.y + j)) && ((stone.y + j) < size)));
}

// *** Buttons *** //

function undo () {

  if (moves.length > 1){
    grid = _.cloneDeep(moves[moves.length - 2].grid);
    groups = _.cloneDeep(moves[moves.length - 2].groups);
    moves.pop();
  }

  else {
    grid = create2DArray(cols, rows);
    groups = [new Array(), new Array()];
    moves.pop();
    $('#undo').remove();
  }

  player = switchPlayer(player);
}
