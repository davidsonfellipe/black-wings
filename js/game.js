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
var wave=1;
var waveDuration=500;
var upgrades={
    resistence:0,
    shootNumber:0,
    shootPower:0,
    fireRate:0,
    moveSpeed:0,
    loot:0,
    magnet:0
  };
var upgradesProg={
    resistence:{base:100,mult:2},
    shootNumber:{base:200,mult:2},
    shootPower:{base:100,mult:2},
    fireRate:{base:100,mult:2},
    moveSpeed:{base:100,mult:2},
    loot:{base:100,mult:2},
    magnet:{base:100,mult:2}
  };
var player;
var playerMaxLife=100;
var imgsPraCarregar=0;
var imgsCarregadas=0;
var timeSpawnEnimy;
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
  carrega("baseplaneBoss1","img/boss1.png");
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
      /*player=new plane(500,500,true,false);
      things.push(player);*/
      newGame();

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
  timeSpawnEnimy=Math.floor(Math.pow(0.75,wave)*130);
  if(timeCounter<waveDuration){
    timeCounter++;
  }else if(timeCounter==waveDuration){
    creatBoss();
    timeCounter++;
  }else{
  }
  if(timeCounter%timeSpawnEnimy==1){
   // timeCounter=0;
    var enimy=new plane(Math.floor(Math.random()*2)*imgH,Math.random()*1000,false,false);
    enimies.push(enimy);
    things.push(enimy);
  }
  world.x=((1280/2)-player.x);
  world.y=((768/2)-player.y);

  if (world.x +imgW < 1280) world.x = 1280-imgW;
  if (world.x > 0) world.x = 0;
  if (world.y > 0) world.y = 0;
  if (world.y +imgH < 768) world.y = 768-imgH;

  $('.goldDisplay').html(goldAmount);
  atualizaBarra(player.life);

  stage.update();
}
function creatBoss(){
  var enimy=new plane(Math.floor(Math.random()*2)*imgH,Math.random()*1000,false,true);
  enimies.push(enimy);
  things.push(enimy);
}
function nextWave(){
  wave++;
  timeCounter=0;
}
function endGame(){
  $("#screen-pontuacao").show();
  $("#pontuacao").html(score);
  for (var i=0;i<things.length;i++) {
    things[i].active=false;
    things[i].base.x=9999999;
  }
  newGame()
}
function newGame(){
  score = 0;
  things = new Array();
  enimies = new Array();
  player = new plane(500,500,true,false);
  things.push(player);
  timeCounter=0;
  goldAmount=10000;
  isPaused=true;
  var upgrades={
    resistence:0,
    shootNumber:0,
    shootPower:0,
    fireRate:0,
    moveSpeed:0,
    loot:0,
    magnet:0
  };
}
function atualizaBarra(life) {
  if ((life/100) <= 0.3) {
    $('.percent').addClass('danger');
  }else{
    $('.percent').removeClass('danger');
  }
  $('.percent').css('width', ((life/100) * 100) + "%");
}
function updateUpgrades(){
  $('.goldDisplay').html(goldAmount);
  for(var upg in upgrades){
    var html='';
    for(var i=0;i<6;i++){
      if(i<upgrades[upg]){
        html+='<img src="img/upgD.png" />';
      }else{
        html+='<img src="img/upg.png" />';
      }
    }
    $('#upg-'+upg+' div').html(html);
    if(upgrades[upg]<6){
      $('#upg-'+upg+' .cost-upgrade').html('$'+calcUpgrade(upg));
    }else{
      $('#upg-'+upg+' .cost-upgrade').html('MAX');
    }
  }
}
function calcUpgrade (n) {
  var val=upgradesProg[n].base*Math.pow(upgradesProg[n].mult,upgrades[n]);
  return Math.floor(val);
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
    case "btVoltar":
      $screenUpgrades.animate({left: '-1280px'});
      isPaused=false;
      break;
    case "btUpgrades":
      updateUpgrades()
      $screenUpgrades.animate({left: '0px'});
      isPaused=true;
      break;
    default:
      var upgName='';
      var target=e.target;
      while(target){
        if(target.id){
          if(target.id.split('-')[0]=='upg'){
            upgName=target.id.split('-')[1];
            break;
          }
        }
        target=target.parentNode;
      }
      if(upgName!=''){
        if(goldAmount>=calcUpgrade(upgName) && upgrades[upgName]<6){
          goldAmount-=calcUpgrade(upgName);
          upgrades[upgName]++;
          updateUpgrades();
        }
      }
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
    if (px > 80) px=80;
    if (px < -80) px=-80;
    if (py > 80) py=80;
    if (py < -80) py=-80;

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