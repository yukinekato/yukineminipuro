"use strict"
var canvas, ctx;
var img_player;
var img_enemy;
var player_x, player_y;

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
 if(moved){
   ctx.clearRect(0,0,canvas.width,canvas.height);
   ctx.drawImage(img_player,player_x,player_y);
 }
};
window.onload=function(){
  canvas=document.getElementById('screen');
  ctx=canvas.getContext('2d');
  img_player=document.getElementById('player');
  img_enemy=document.getElementById('enemy');
  player_x=(canvas.width-player.width)/2;
  player_y=(canvas.height-player.height)-20;
  ctx.drawImage(img_player, player_x, player_y);
  for(var i=0; i<10; i++){
  ctx.drawImage(img_enemy,Math.random()*(canvas.width-img_enemy.width),Math.random()*(canvas.height-img_enemy.height));

 }
};
