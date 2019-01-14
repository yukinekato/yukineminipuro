// 手も足も出なかったのでとりあえず
// https://lambdalisue.hatenablog.com/entry/2013/12/25/160910"use strict"
// で一週間ほどかけて勉強してからつくりました。
var canvas, ctx;
var FPS= 30;
var MSPF=1000/FPS;
var KEYS = new Array(256);
// 繰り返し（条件）
for(var i=0; i<KEYS.length; i++){
    KEYS[i]=false;
  }

var FIRE_INTERVAL = 20;
var STAR_INTERVAL = 20;
var BULLETS = 5;
var　ENEMIES=10;
var img_player;
var img_player_bullet;
var img_enemy;
var player_x, player_y;
var player_bullets_x = new Array(BULLETS);
var player_bullets_y = new Array(BULLETS);
var enemies_x = new Array(ENEMIES);
var enemies_y = new Array(ENEMIES);
var player_hp;
var player_bullets_hp = new Array(BULLETS);

var enemies_hp = new Array(ENEMIES);
var player_fire_interval=0;
var player_star_interval=0;
var killed = 0;
var redraw =function(){
   ctx.clearRect(0,0,canvas.width,canvas.height);
  if(player_hp > 0){
    ctx.save();
	        if(player_star_interval % 2 != 0) {
	            ctx.globalAlpha = 0.5;
	        }
   ctx.drawImage(img_player, player_x, player_y);
   ctx.restore();
 }

  for(var i=0; i<BULLETS; i++){
    if(player_bullets_hp[i] > 0){
       ctx.drawImage(img_player_bullet,
                   player_bullets_x[i],
                   player_bullets_y[i]);
    }
  }
  for(var i=0; i<ENEMIES; i++){
  if(enemies_hp[i] > 0){
  ctx.drawImage(img_enemy, enemies_x[i], enemies_y[i]);
   }
  }
 ctx.save();
 ctx.fillStyle = '#fff';
 ctx.fillRect(10, canvas.height-10, 10 * 5, 5);
 ctx.fillStyle = '#f00';
 ctx.fillRect(10, canvas.height-10, player_hp * 5, 5);
 var text = "Killed: " + killed + "/" + ENEMIES;
 var width = ctx.measureText(text).width;
 ctx.fillStyle = '#fff';
 ctx.fillText(text,
              canvas.width - 10 - width,
              canvas.height - 10);
              // 条件分岐（条件）
              if(player_hp <= 0){
	        ctx.globalAlpha = 0.5;
	        ctx.fillStyle = '#000';
	        ctx.fillRect(0, 0, canvas.width, canvas.height);
	        ctx.globalAlpha = 1.0;
	        ctx.font = '20px sans-serif';
	        ctx.textBaseline = 'middle';
	        ctx.fillStyle = '#f00';
	        text = "Game Over";
	        width = ctx.measureText(text).width;
	        ctx.fillText(text,
	                     (canvas.width - width) / 2,
	                     canvas.height / 2);
                     }
      else if(killed == ENEMIES){

	        ctx.globalAlpha = 0.5;
	        ctx.fillStyle = '#000';
	        ctx.fillRect(0, 0, canvas.width, canvas.height);
	        ctx.globalAlpha = 1.0;
	        ctx.font = '20px sans-serif';
	        ctx.textBaseline = 'middle';
	        ctx.fillStyle = '#fff';
	        text = "Game Clear";
	        width = ctx.measureText(text).width;
	        ctx.fillText(text,
	                     (canvas.width - width) / 2,
	                     canvas.height / 2);

	    }



 ctx.restore();
};


 var movePlayer = function(){
   if(player_hp <= 0){
       return;
     }

  var SPEED = 2;
  var RIGHT = 74;
  var LEFT = 70;
  var UP = 32;
  if (KEYS[RIGHT] && player_x+img_player.width < canvas.width){
     player_x += SPEED;
   }
  if (KEYS[LEFT] && player_x > 0){
      player_x -= SPEED;
  }
  if(KEYS[UP] && player_fire_interval == 0){
    for(var i=0; i<BULLETS;  i++){
      if(player_bullets_hp[i]  == 0){
        player_bullets_x[i] = player_x;
        player_bullets_y[i] = player_y;
         player_bullets_hp[i] = 1;
         player_fire_interval = FIRE_INTERVAL;
          break;
      }
    }
  }

	    if(player_fire_interval > 0) {
	        player_fire_interval--;
	    }

  if(player_x < 0) {
       player_x = 0;
   } else if (player_x + img_player.width > canvas.width) {
       player_x = canvas.width - img_player.width;
   }
};

var movePlayerBullets = function() {
	    var SPEED = -6;
	    for(var i=0; i<BULLETS; i++) {
	        if(player_bullets_hp[i] <= 0) {
	            continue;
	        }


	        player_bullets_y[i] += SPEED;


	        if (player_bullets_y[i] < img_player_bullet.height) {
	            player_bullets_hp[i] = 0;
	        }
	    }
	};

  var moveEnemies = function() {
    var SPEED = 2;
    for(var i=0; i<ENEMIES; i++) {

        if(enemies_hp[i] <= 0){
          continue;
        }

       enemies_y[i] += SPEED;

        if (enemies_y[i] > canvas.height) {
            enemies_y[i] = -img_enemy.height;

            enemies_x[i] = Math.random() * (canvas.width - img_enemy.width);
        }
    }
};

var hitCheck = function(x1, y1, obj1, x2, y2, obj2) {
    var cx1, cy1, cx2, cy2, r1, r2, d;

    cx1 = x1 + obj1.width/2;
    cy1 = y1 + obj1.height/2;
    cx2 = x2 + obj2.width/2;
    cy2 = y2 + obj2.height/2;
    r1 = (obj1.width+obj1.height)/4;
    r2 = (obj2.width+obj2.height)/4;

    d = Math.sqrt(Math.pow(cx1-cx2, 2) + Math.pow(cy1-cy2, 2));

    if(r1 + r2 > d) {

        return true;
    } else {

        return false;
    }
};
　var titleloop_blinker = 0;
	var titleloop = function() {
	    var startTime = new Date();


	    ctx.clearRect(0, 0, canvas.width, canvas.height);


	    ctx.save();
      ctx.strokeStyle = '#fff';
	    ctx.beginPath();
	    ctx.moveTo(20, 100);
	    ctx.lineTo(canvas.width-20, 100);
	    ctx.stroke();
	    ctx.beginPath();
	    ctx.moveTo(20, 145);
	    ctx.lineTo(canvas.width-20, 145);
	    ctx.stroke();
	    ctx.strokeStyle = '#444';
	    ctx.beginPath();
	    ctx.moveTo(30, 90);
	    ctx.lineTo(canvas.width-30, 90);
	    ctx.stroke();
	    ctx.beginPath();
	    ctx.moveTo(30, 155);
	    ctx.lineTo(canvas.width-30, 155);
	    ctx.stroke();

	    var text, width;
	    ctx.font = '20px serif';
	    ctx.textBaseline = 'middle';
	    ctx.fillStyle = '#fff';
      text = "JavaScript Shooting";
 	    width = ctx.measureText(text).width;
 	    ctx.fillText(text, (canvas.width - width) / 2, 120);


 	    titleloop_blinker++;
 	    if(titleloop_blinker > 20) {

 	        ctx.globalAlpha = 0.5;

 	        if(titleloop_blinker > 30) {
 	            titleloop_blinker = 0;
 	        }
 	    }
 	    ctx.font = '12px sans-serif';
 	    ctx.textBaseline = 'middle';
 	    text = "Hit esc to Start";
 	    width = ctx.measureText(text).width;
 	    ctx.fillText(text, (canvas.width - width) / 2, 240);
 	    ctx.globalAlpha = 1.0;
	    ctx.restore();
	    var ESC = 　27;
	    if(KEYS[ESC]) {
	        mainloop();
	        return;
	    }

	    var deltaTime = (new Date()) - startTime;
	    var interval = MSPF - deltaTime;
	    if(interval > 0) {
	        setTimeout(titleloop, interval);
	    } else {
	        setTimeout(titleloop, 0);
	    }
	};



  var mainloop = function() {
  var startTime = new Date();
    movePlayer();
    movePlayerBullets();
    moveEnemies();
    if(player_hp > 0 && player_star_interval == 0) {
        for(var i=0; i<ENEMIES; i++) {
            if(enemies_hp[i] > 0) {
              if(hitCheck(player_x, player_y, img_player,
                          enemies_x[i], enemies_y[i], img_enemy)){
                    player_hp -= 1;
                    enemies_hp[i] -=1;
               if(enemies_hp[i] == 0) {
	                        killed++;
	                }
                  player_star_interval = STAR_INTERVAL;
                }
              }
            }
          }
          if(player_star_interval > 0) {
	        player_star_interval--;
	      }
        if(player_hp > 0) {
                for(var i=0; i<ENEMIES; i++) {
                   if(enemies_hp[i] <= 0) {
                        continue;
                     }
                      for(var j=0; j<BULLETS; j++) {
                           if(player_bullets_hp[j] <= 0) {
                               continue;
                           }
                           if(hitCheck(player_bullets_x[j],
                                       player_bullets_y[j],
                                       img_player_bullet,
                                       enemies_x[i],
                                       enemies_y[i],
                                       img_enemy)){
                               player_bullets_hp[j] -= 1;
                               enemies_hp[i] -=1;
                               if(enemies_hp[i] == 0) {
	                        killed++;
	                           }
                           }
                       }
                   }
               }

    redraw();

  var deltaTime = (new Date()) - startTime;
  var interval = MSPF - deltaTime;
   if(interval > 0) {
      setTimeout(mainloop, interval);
    } else {
    setTimeout(mainloop, 0);
    }
  };
  window.onkeydown=function(e){
    KEYS[e.keyCode]=true;
  }
  window.onkeyup=function(e){
    KEYS[e.keyCode]=false;
  }

window.onload=function(){
  canvas=document.getElementById('screen');
  ctx=canvas.getContext('2d');
  img_player=document.getElementById('player');
  img_player_bullet = document.getElementById('player_bullet');
  img_enemy=document.getElementById('enemy');
  player_x=(canvas.width - player.width)/2;
  player_y=(canvas.height - player.height)-20;
  player_hp = 10;

  for(var i=0; i<BULLETS; i++){
    player_bullets_x[i] = 0;
    player_bullets_y[i]= 0;
    player_bullets_hp[i] = 0;
  }
  for(var i=0; i<ENEMIES; i++){
    enemies_x[i] =Math.random()*(canvas.width-img_enemy.width);
    enemies_y[i] =Math.random()*(canvas.height-img_enemy.height);
    enemies_hp[i]=2;
   }
   titleloop();
}
