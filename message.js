function Message(message){
  this.message = message;
  this.duration = 0;

  let fade = 255;
  let yOffset = 0;

  this.show = function(){
    fill(255, 0, 0, fade);
    textSize(50);
    textAlign(CENTER, CENTER);
    text(this.message, width/2, -50 + height/2 + yOffset);
    fade -= 1;
    yOffset += 1;
    this.duration += 1;
  }
}
