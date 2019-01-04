"use strict"
var canvas, ctx;
var FPS= 30;
var MSPF=1000/FPS;
var　ENEMIES=10;
var img_player;
var img_enemy;
var player_x, player_y;
var enemies_x = new Array(ENEMIES);
var enemies_y = new Array(ENEMIES);
var redraw =function(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img_player, player_x, player_y);
  for(var i=0; i<ENEMIES; i++){
    ctx.drawImage(img_enemy,enemies_x[i],enemies_y[i]);

  }
};

window.onkeydown=function(e){
  var SPEED=2;
  var RIGHT=39;
  var LEFT=37;
  var moved=false;
  if(e.keyCode == RIGHT){
   player_x+=SPEED;
   moved=true;
 }else if(e.keyCode==LEFT){
   player_x-=SPEED;
   moved=true;
 }
};

 
   var mainloop = function() {
    var startTime = new Date();
    redraw();
  var deltaTime = (new Date()) - startTime;
  var interval = MSPF - deltaTime;
   if(interval > 0) {
      setTimeout(mainloop, interval);
    } else {
      mainloop();
    }
  };
window.onload=function(){
  canvas=document.getElementById('screen');
  ctx=canvas.getContext('2d');
  img_player=document.getElementById('player');
  img_enemy=document.getElementById('enemy');
  player_x=(canvas.width-player.width)/2;
  player_y=(canvas.height-player.height)-20;
  for(var i=0; i<ENEMIES; i++){
    enemies_x[i]=Math.random()*(canvas.width-img_enemy.width);
    enemies_y[i]=Math.random()*(canvas.height-img_enemy.height);
   }
   mainloop();
};
