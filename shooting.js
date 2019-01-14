// 手も足も出なかったのでとりあえず
// https://lambdalisue.hatenablog.com/entry/2013/12/25/160910"use strict"
// で一週間ほどかけて勉強してからつくりました。
// コードのコメントを書かないとわかりにくいことに気づき最後の方に書き足しています

"use strict"
var canvas, ctx;
// FPS：なめらかさを表す単位
var FPS= 30;
var MSPF=1000/FPS;
var KEYS = new Array(256);
for(var i=0; i<KEYS.length; i++){
    KEYS[i]=false;
  }
  // 弾発射インターバル
var FIRE_INTERVAL = 20;
// 無敵インターバル（敵に当たった時に無敵になる時間）
var STAR_INTERVAL = 20;
// 弾の数を定義
var BULLETS = 5;
// カラスの数を定義
var　CROWS=10;
// 鴨、弾、カラスの画像の変数を定義
var img_duck;
var img_duck_bullet;
var img_crow;
// 鴨、カラスの現在位置。BULLETSの要素数で配列を作っていく。
var duck_x, duck_y;
var duck_bullets_x = new Array(BULLETS);
var duck_bullets_y = new Array(BULLETS);

var crows_x = new Array(CROWS);
var crows_y = new Array(CROWS);
// 鴨、弾、カラスのhpを定義
var duck_hp;
var duck_bullets_hp = new Array(BULLETS);
var crows_hp = new Array(CROWS);
// 鴨がでるまでのインターバル、無敵になるまでのインターバル
var duck_fire_interval=0;
var duck_star_interval=0;
// 倒したカラスの数を保存する数の定義
var killed = 0;
// 再描画
var redraw =function(){
  // ctx.clearRect（x,y,w,h）- 四角形の形にクリアする
   ctx.clearRect(0,0,canvas.width,canvas.height);
   // 鴨が生きている場合のみ描画
  if(duck_hp > 0){
    // 透明度を変えたいので一旦保存
    ctx.save();
    // 　　　無敵になるまでのインターバルが２で割れないときだけ半透明にする
	        if(duck_star_interval % 2 != 0) {
            // globalAlpha属性は、図形やイメージの透明度を指定する際に使用　　
	            ctx.globalAlpha = 0.5;
	        }
          // イメージを描画する
   ctx.drawImage(img_duck, duck_x, duck_y);
   // 描画状態を保存した時点のものに戻す（７行前）
   ctx.restore();
 }

// for文
// 弾
  for(var i=0; i<BULLETS; i++){
    if(duck_bullets_hp[i] > 0){
       ctx.drawImage(img_duck_bullet,
                   duck_bullets_x[i],
                   duck_bullets_y[i]);
    }
  }
  // カラス
  for(var i=0; i<CROWS; i++){
  if(crows_hp[i] > 0){
  ctx.drawImage(img_crow,
                 crows_x[i],
                 crows_y[i]);
   }
  }
  // 現在の描画状態を保存する
 ctx.save();
 // 塗りつぶしの色やスタイルを指定する（鴨のhpの最大値）
 ctx.fillStyle = '#fff';
 // 塗りつぶしの四角形を描く（鴨のhpの最大値）
 ctx.fillRect(10, canvas.height-10, 10 * 5, 5);
 // 線・輪郭の色やスタイルを指定する（鴨残りhp）
 ctx.fillStyle = '#f00';
 ctx.fillRect(10, canvas.height-10, duck_hp * 5, 5);
 // "Killed: " + killed（倒したカラスの数） + "/" + CROWS（カラス全部の数）
 var text = "Killed: " + killed + "/" + CROWS;
 // テキストの描画幅を測定する
 var width = ctx.measureText(text).width;
 // 塗りつぶしの色やスタイルを指定する
 ctx.fillStyle = '#fff';
 // 塗りつぶしのテキストを指定座標に描画する
 ctx.fillText(text,
              canvas.width - 10 - width,
              canvas.height - 10);

// ゲームオーバー画面の作 １、黒の半透明画面
// 　if文　条件分岐
  if(duck_hp <= 0){
	        ctx.globalAlpha = 0.5;
	        ctx.fillStyle = '#000';
          // 全体の色＝黒の半透明で覆う
	        ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ２、赤の文字画面
	        ctx.globalAlpha = 1.0;
　　　　// フォントのスタイル・サイズ・種類を指定する
	        ctx.font = '20px sans-serif';
          // ベースラインの位置を指定する
	        ctx.textBaseline = 'middle';
	        ctx.fillStyle = '#f00';
	        text = "Game Over";
	        width = ctx.measureText(text).width;
	        ctx.fillText(text,
	                     (canvas.width - width) / 2,
	                     canvas.height / 2);
                     }
      // duck_hp <= 0　ではなく   killed == CROWS　であったとき
                // １、黒の半透明画面　２、白の文字画面　（やり方は上と同じ）
      else if(killed == CROWS){

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


// 描画状態を保存した時点のものに戻す（
 ctx.restore();
};

// 鴨移動処理
 var moveduck = function(){
   // もしもduck_hp <= 0なら
   if(duck_hp <= 0){
     // returnが実行されるとそれ以降の処理は実行されずに中断する＝つまり、duck_hp <= 0のとき以下は行わない
       return;
     }
// 移動速度を定義
  var SPEED = 2;
  // キー番号のまま進めるとわかりにくいから変数で定義
  var RIGHT = 74;
  var LEFT = 70;
  var UP = 32;
  // これは四角から鴨が飛びなさないようにするため
  if (KEYS[RIGHT] && duck_x+img_duck.width < canvas.width){
     duck_x += SPEED;
   }
  if (KEYS[LEFT] && duck_x > 0){
      duck_x -= SPEED;
  }
  // (KEYS[UP]（スペースキーが押される） && duck_fire_interval == 0（インターバルが０に戻っている）
  if(KEYS[UP] && duck_fire_interval == 0){
    for(var i=0; i<BULLETS;  i++){
      if(duck_bullets_hp[i]  == 0){
        // 弾は鴨が発射するので初期位置が同じ
        duck_bullets_x[i] = duck_x;
        duck_bullets_y[i] = duck_y;
        // 弾のhpは１。弾を撃ったらFIRE_INTERVALの値が上がる。
        duck_bullets_hp[i] = 1;
         duck_fire_interval = FIRE_INTERVAL;
         // 繰り返し文のループ処理から抜け出すことができる、弾を撃ったので抜け出す
          break;
      }
    }
  }

	    if(duck_fire_interval > 0) {
	        duck_fire_interval--;
	    }
 // プレイヤーがはみ出てしまった場合は強制的に中に戻す
  if(duck_x < 0) {
       duck_x = 0;
   } else if (duck_x + img_duck.width > canvas.width) {
       duck_x = canvas.width - img_duck.width;
   }
};

// 弾移動処理
var moveduckBullets = function() {
	    var SPEED = -6;
      // 各弾ごとに処理を行う。
	    for(var i=0; i<BULLETS; i++) {
        // 上の処理は生きている場合のみ
	        if(duck_bullets_hp[i] <= 0) {
	            continue;
	        }


	        duck_bullets_y[i] += SPEED;

// 　　　　　　　　弾が上にはみ出た場合、hpを０にしてリセット
	        if (duck_bullets_y[i] < img_duck_bullet.height) {
	            duck_bullets_hp[i] = 0;
	        }
	    }
	};
// カラス移動処理　
  var moveCrows = function() {
    var SPEED = 2;
    for(var i=0; i<CROWS; i++) {

        if(crows_hp[i] <= 0){
          continue;
        }

       crows_y[i] += SPEED;　
// 　　　カラスが四角からはみ出した場合、上に戻す
        if (crows_y[i] > canvas.height) {
            crows_y[i] = -img_crow.height;
// Math.random:0 以上 1 未満の疑似ランダムな浮動小数点による小数
// これによりランダムにx座標がでる
          crows_x[i] = Math.random() * (canvas.width - img_crow.width);
        }
    }
};
// 当たり判定（三平方の定理でx、y座標にしたがっていく）（正直当たり判定はあまり理解できていない）
//今回は 自分・対象の中心座標と自分・対象の当たり判定用円の半径の二つからなる
var hitCheck = function(x1, y1, obj1, x2, y2, obj2) {
    var cx1, cy1, cx2, cy2, r1, r2, d;

    cx1 = x1 + obj1.width/2;
    cy1 = y1 + obj1.height/2;
    cx2 = x2 + obj2.width/2;
    cy2 = y2 + obj2.height/2;
    r1 = (obj1.width+obj1.height)/4;
    r2 = (obj2.width+obj2.height)/4;

        //  Math.sqrt(d) -- dのルートを返す　　Math.pow(x, a) -- xのa乗を返す
    d = Math.sqrt(Math.pow(cx1-cx2, 2) + Math.pow(cy1-cy2, 2));

    if(r1 + r2 > d) {

        return true;
    } else {

        return false;
    }
};
// タイトルループを定義
　var titleloop_blinker = 0;
	var titleloop = function() {
    // 処理開始時間の保存
	    var startTime = new Date();

// 　　　最初の画面をつくる
　　　// ctx.clearRect（x,y,w,h）- 四角形の形にクリアする
　　　 ctx.clearRect(0, 0, canvas.width, canvas.height);
　　　　// 現在の描画状態を保存する
　　　 ctx.save();
      // 線・輪郭の色やスタイルを指定する（ラインで装飾）
      ctx.strokeStyle = '#fff';
      // 現在のパスをリセットする
      // 授業でやった星と考え方はおなじ
	    ctx.beginPath();
      // 新しいサブパスの開始点を座標指定する
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
      text = "crow hunter";
 	    width = ctx.measureText(text).width;
 	    ctx.fillText(text, (canvas.width - width) / 2, 120);


 	    titleloop_blinker++;
 	    if(titleloop_blinker > 20) {
　　　// 点滅処理様に透過度を調整
 	        ctx.globalAlpha = 0.5;
　　　　// 　　300を超えていたら0に戻す
 	        if(titleloop_blinker > 30) {
 	            titleloop_blinker = 0;
 	        }
 	    }

 	    ctx.font = '12px sans-serif';
 	    ctx.textBaseline = 'middle';
      // escを押したらスタートする
 	    text = "Hit esc to Start";
 	    width = ctx.measureText(text).width;
 	    ctx.fillText(text, (canvas.width - width) / 2, 240);
 	    ctx.globalAlpha = 1.0;
      // 描画状態を保存した時点のものに戻す（
　　　　　ctx.restore();

      // escのキーを変数で定義
	    var ESC = 　27;
	    if(KEYS[ESC]) {
        // メインループを呼び出す
	        mainloop();
          // titleloopを抜ける
	        return;
	    }


// 処理経過時間および次のループまでの間隔を計算
	    var deltaTime = (new Date()) - startTime;
	    var interval = MSPF - deltaTime;
	    if(interval > 0) {
        // 処理が早いー待つ（interval）
	        setTimeout(titleloop, interval);
          // 処理が遅いーすぐに次のループ
	    } else {
	        setTimeout(titleloop, 0);
	    }
	};


// メインループを定義
  var mainloop = function() {
    // 処理時間の保存
  var startTime = new Date();
  // 鴨、弾、カラスの移動処理
    moveduck();
    moveduckBullets();
    moveCrows();
    // プレイヤーと敵キャラの当たり判定（プレイヤーが生きている場合）
    // かつプレイヤーが無敵ではない場合
    if(duck_hp > 0 && duck_star_interval == 0) {
        for(var i=0; i<CROWS; i++) {
          // カラスが生きている場合
            if(crows_hp[i] > 0) {
              if(hitCheck(duck_x, duck_y, img_duck,
                          crows_x[i], crows_y[i], img_crow)){
              // ヒットしたので鴨カラス共にhpを−１する
                    duck_hp -= 1;
                    crows_hp[i] -=1;
                  // カラスが死んだら killed  （倒したカラスの数を保存する変数）をふやす
               if(crows_hp[i] == 0) {
	                        killed++;
	                }
                  // 鴨を無敵にする
                  duck_star_interval = STAR_INTERVAL;
                }
              }
            }
          }
          // プレイヤーが無敵である時、その時間を現象させていく
          if(duck_star_interval > 0) {
	        duck_star_interval--;
	      }

        if(duck_hp > 0) {
                for(var i=0; i<CROWS; i++) {
                  // カラスが死んでいる場合はcontinue（そのまま進める）
                   if(crows_hp[i] <= 0) {
                        continue;
                     }
                      for(var j=0; j<CROWS; j++) {
                        // 弾が死んでいる場合はcontinue（そのまま進める
                           if(duck_bullets_hp[j] <= 0) {
                               continue;
                           }

                           if(hitCheck(duck_bullets_x[j],
                                       duck_bullets_y[j],
                                       img_duck_bullet,
                                       crows_x[i],
                                       crows_y[i],
                                       img_crow)){
                              duck_bullets_hp[j] -= 1;
                               crows_hp[i] -=1;
                               if(crows_hp[i] == 0) {
	                        killed++;
	                           }
                           }
                       }
                   }
               }
// 描画する
    redraw();

  var deltaTime = (new Date()) - startTime;
  var interval = MSPF - deltaTime;
   if(interval > 0) {
      setTimeout(mainloop, interval);
    } else {
    setTimeout(mainloop, 0);
    }
  };

  // キーが押された時（onkeydown）に呼び出される処理を指定
  window.onkeydown=function(e){
    KEYS[e.keyCode]=true;
  }
  window.onkeyup=function(e){
    KEYS[e.keyCode]=false;
  }
// ページロード時に呼び出される処理を指定
window.onload=function(){
  canvas=document.getElementById('screen');
  ctx=canvas.getContext('2d');
  // 鴨、弾、カラスの画像を指定
  img_duck=document.getElementById('duck');
  img_duck_bullet = document.getElementById('duck_bullet');
  img_crow=document.getElementById('crow');
  // 鴨の初期位置＆hp
  duck_x=(canvas.width - duck.width)/2;
  duck_y=(canvas.height -duck.height)-20;
  duck_hp = 10;

// 弾の初期位置＆hp
  for(var i=0; i<BULLETS; i++){
  　duck_bullets_x[i] = 0;
  　duck_bullets_y[i]= 0;
    duck_bullets_hp[i] = 0;
  }
  // カラスの初期位置＆hp
  for(var i=0; i<CROWS; i++){
    crows_x[i] =Math.random()*(canvas.width-img_crow.width);
    crows_y[i] =Math.random()*(canvas.height-img_crow.height);
    crows_hp[i]=2;
   }
   // タイトルループを開始
   titleloop();
}
