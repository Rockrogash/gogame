function Group(stones){

  this.stones = stones;
  this.freedoms = [];

  this.calcFreedoms = function() {
    for (let stone of this.stones) {
      for (var neighbor of neighbors) {
        //Check if neighboring fields of stone are still in bounds of grid
        if (inBounds(neighbor.x, neighbor.y, stone)) {
          //Check if new freedom is already in freedoms, if it isnt push into freedoms
          if (grid[stone.x + neighbor.x][stone.y + neighbor.y] == null) {
            var index = this.freedoms.findIndex(freedom => (freedom.x == (stone.x + neighbor.x)) && (freedom.y == (stone.y + neighbor.y)));
            if (index == -1) {
              this.freedoms.push({x: (stone.x + neighbor.x), y: (stone.y + neighbor.y)});
              //console.log(this.freedoms);

            }
          }
          //Check if a freedom no longer is one, if so remove from freedoms
          else {
            var index = this.freedoms.findIndex(freedom => (freedom.x == (stone.x + neighbor.x)) && (freedom.y == (stone.y + neighbor.y)));
            if (index != -1) {
              this.freedoms.splice(index, 1);

            }
          }
        }
      }
    }
  }
}
