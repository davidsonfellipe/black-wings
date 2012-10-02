var onMove=false;
var isPaused=true;
var stage;
var defX=120;
var defY=100;
var ckX=30;
var ckY=30;
var imgW=1420;
var imgH=1100;
var score=0;
var images=new Array();
var infX=0,infY=0;
var spriteSheets=new Array();
var world=new createjs.Container();
var things=new Array();
var enimies=new Array();
var shots=new Array();
var player;
var playerMaxLife=100;
var imgsPraCarregar=0;
var imgsCarregadas=0;
var timeSpawnEnimy=100;
var timeCounter=0
var goldAmount=0;
var mouseObj={x:0,y:0}
var $screenStart,
    $screenPause,
    $screenGameover,
    $screenUpgrades;

document.ontouchstart = touchMouse;
document.onmousedown = touchMouse;
document.ontouchmove = touchMove;
document.onmousemove = touchMove;
document.ontouchend = touchEnd;
document.onmouseup = touchEnd;

//var t_d=68,t_a=65,t_w=67,t_s=64;
window.onload=function() {
  canvas = document.getElementById("game");
  stage = new createjs.Stage(canvas);
  $screenStart = $("#screen-start"),
  $screenPause = $("#screen-pause"),
  $screenGameover = $("#screen-pontuacao");
  $screenUpgrades = $("#screen-upgrades");
  carrega("BackGround","img/bg.gif","BackGround");
  carrega("shootImg","img/shot.png","shoot");
  carrega("goldImg","img/gold.png","gold");
  carrega("healImg","img/heal.png","heal");
  carrega("shootPlayerImg","img/shot-player.png","shoot-player");
  carrega("baseplane","img/plane.png","Base");
  carrega("baseplaneEnimy1","img/inimigo1.png");
  carrega("baseplaneEnimy2","img/inimigo2.png");
  carrega("baseplaneEnimy3","img/inimigo3.png");
}

function carrega(img,path,resul){
  imgsPraCarregar++;
  images[img]= new Image();
  images[img].onload = function(){
    imgsCarregadas++;
    if(imgsCarregadas==imgsPraCarregar){
      var bg = new createjs.Bitmap(images['BackGround']);
      world.addChild(bg)
      bg.x=0;
      bg.y=0;
      stage.addChild(world);
      player=new plane(500,500,true);
      things.push(player);

      createjs.Ticker.addListener(window);
      createjs.Ticker.useRAF = true;
      createjs.Ticker.setFPS(30);
    }
  }
  images[img].src=path;
}

function tick() {
  if(isPaused)return;
  for(var i=0;i<things.length;i++){
    things[i].enterFrame();
  }
  timeCounter++;
  if(timeCounter>timeSpawnEnimy){
    timeCounter=0;
    var enimy=new plane(Math.floor(Math.random()*2)*imgH,Math.random()*1000,false);
    enimies.push(enimy);
    things.push(enimy);
  }
  world.x=((1280/2)-player.x);
  world.y=((768/2)-player.y);

  if (world.x +imgW < 1280) world.x = 1280-imgW;
  if (world.x > 0) world.x = 0;
  if (world.y > 0) world.y = 0;
  if (world.y +imgH < 768) world.y = 768-imgH;

  $('#goldDisplay').html(goldAmount);
  atualizaBarra(player.life);

  stage.update();
}
function atualizaBarra(life) {
  if ((life/100) <= 0.3) {
    $('.percent').addClass('danger');
  }
  $('.percent').css('width', ((life/100) * 100) + "%");
}
function endGame(){
  $("#screen-pontuacao").show();
  $("#pontuacao").html(score);
  $('.percent').removeClass('danger');
  score = 0;
  for (var i=0;i<things.length;i++) {
    things[i].active=false;
    things[i].base.x=9999999;
  }
  things = new Array();
  enimies = new Array();
  player = new plane(500,500,true);
  things.push(player);
  timeCounter=0;
  goldAmount=0;
  isPause=true;
}

function touchMouse (e) {
  if (e.target.id == "areaControl") {
    onMove=true;

    if (e.targetTouches) {
      mouseObj.x=e.targetTouches[0].pageX;
      mouseObj.y=e.targetTouches[0].pageY;
    } else {
      mouseObj.x=e.pageX;
      mouseObj.y=e.pageY;
    }

    ckX=mouseObj.x;
    ckY=mouseObj.y;
  }

  switch(e.target.id){
    case "screen-start":
      $screenStart.animate({top: '-768px'});
      isPaused = false;
      break;
    case "bt-pause":
      if (!isPaused) {
        isPaused = true;
        $screenPause.fadeIn();
      }
      break;
    case "screen-pause":
      isPaused = false;
      $screenPause.fadeOut();
      break;
    case "screen-pontuacao":
      $screenGameover.fadeOut();
      isPaused=false;
      break;
    case "screen-upgrades":
      $screenUpgrades.animate({left: '-1280px'});
      isPaused=false;
      break;
    case "btUpgrades":
      $screenUpgrades.animate({left: '0px'});
      isPaused=true;
      break;
  }
  e.preventDefault();
};

function touchMove(e) {
  if (e.targetTouches) {
    mouseObj.x=e.targetTouches[0].pageX;
    mouseObj.y=e.targetTouches[0].pageY;
  } else {
    mouseObj.x=e.pageX;
    mouseObj.y=e.pageY;
  }

  if(onMove){
    var px=mouseObj.x-ckX;
    var py=mouseObj.y-ckY;
    if (px > 60) px=60;
    if (px < -60) px=-60;
    if (py > 60) py=60;
    if (py < -60) py=-60;

    $("#areaControl").css('bottom',(-py+defY)+"px");
    $("#areaControl").css('right',(-px+defX)+"px");
    infX=(px)*0.03;
    infY=(py)*0.03;
  }
}

function touchEnd() {
  onMove=false;
  infX=0;
  infY=0;
  $("#areaControl").css('bottom',defY+"px");
  $("#areaControl").css( 'right',defX+"px");
}