function Group(stones){

  this.stones = stones;
  this.liberties = [];

  this.calcLiberties = function() {
    for (let stone of this.stones) {
      for (var neighbor of neighbors) {
        //Check if neighboring fields of stone are still in bounds of grid
        if (inBounds(neighbor.x, neighbor.y, stone)) {
          //Check if new liberty is already in liberties, if it isnt push into liberties
          if (grid[stone.x + neighbor.x][stone.y + neighbor.y] == null) {
            var index = this.liberties.findIndex(liberty => (liberty.x == (stone.x + neighbor.x)) && (liberty.y == (stone.y + neighbor.y)));
            if (index == -1) {
              this.liberties.push({x: (stone.x + neighbor.x), y: (stone.y + neighbor.y)});
            }
          }
          //Check if a liberty no longer is one, if so remove from liberties
          else {
            var index = this.liberties.findIndex(liberty => (liberty.x == (stone.x + neighbor.x)) && (liberty.y == (stone.y + neighbor.y)));
            if (index != -1) {
              this.liberties.splice(index, 1);
            }
          }
        }
      }
    }
  }
}
