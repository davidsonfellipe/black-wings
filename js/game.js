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
var lifePercent=1;
var baseplane = new Image();
var baseplaneEnimy1 = new Image();
var baseplaneEnimy2 = new Image();
var baseplaneEnimy3 = new Image();
var BackGround = new Image();
var shootImg = new Image();
var shootPlayerImg = new Image();
var tecla=new Array();
var infX=0,infY=0;
var spriteSheets=new Array();
var world=new createjs.Container();
//var spriteSheetBase,spriteSheetTopo,spriteSheetBaseEnimy,spriteSheetTopoEnimy;
var things=new Array();
var enimys=new Array();
var shots=new Array();
var player;
var imgsPraCarregar=0;
var imgsCarregadas=0;
var timeEnimy=100;
var timee=0
var mouseObj={x:0,y:0}
//var t_d=68,t_a=65,t_w=67,t_s=64;
window.onload=function() {
  canvas = document.getElementById("game");
  stage = new createjs.Stage(canvas);

  carrega(BackGround,"img/bg.gif","BackGround",null);
  carrega(shootImg,"img/shot.png","shoot",null);
  carrega(shootPlayerImg,"img/shot-player.png","shoot-player",null);
  carrega(baseplane,"img/plane.png","Base",{
        images: [baseplane],
        frames: {width: 150, height: 150, regX: 75, regY: 75},
        animations:{
            baseRotation: [0, 8, "baseRotation",3]
        }
    });
  carrega(baseplaneEnimy1,"img/inimigo1.png",null);
  carrega(baseplaneEnimy2,"img/inimigo2.png",null);
  carrega(baseplaneEnimy3,"img/inimigo3.png",null);

  // $("#areaControl").mousedown(function(e){
  //     onMove=true;
  //     ckX=mouseObj.x;
  //     ckY=mouseObj.y;
  //    });
  // $(document).mouseup(function(e){
  //     onMove=false;
  //     infX=0;
  //     infY=0;
  //     $("#areaControl").css('bottom',defY+"px");
  //     $("#areaControl").css( 'right',defX+"px");
  //    });
}

function carrega(img,path,resul,dados){
  imgsPraCarregar++;
  img.onload = function(){
    if(dados){
      spriteSheets[resul] = new createjs.SpriteSheet(dados);
    }else{
      //Back; = new createjs.Bitmap(dados);
      //  BackGround=img;
    }
    imgsCarregadas++;
    if(imgsCarregadas==imgsPraCarregar){
      var bg = new createjs.Bitmap(BackGround);
      world.addChild(bg)
      bg.x=0;
      bg.y=0;
      stage.addChild(world);
      //world.x=500;
      player=new plane(500,500,true);
      things.push(player);

      createjs.Ticker.addListener(window);
      createjs.Ticker.useRAF = true;
      createjs.Ticker.setFPS(30);
    }
  }
  img.src=path;
}

function tick() {
  if(isPaused)return;
  for(var i=0;i<things.length;i++){
    things[i].enterFrame();
  }
  timee++;
  if(timee>timeEnimy){
    timee=0;
    var enimy=new plane(Math.floor(Math.random()*2)*imgH,Math.random()*1000,false);
    enimys.push(enimy);
    things.push(enimy);
  }
  world.x=((1280/2)-player.x);
  world.y=((768/2)-player.y);

  if (world.x +imgW < 1280) world.x = 1280-imgW;
  if (world.x > 0) world.x = 0;
  if (world.y > 0) world.y = 0;
  if (world.y +imgH < 768) world.y = 768-imgH;
  lifePercent=player.life/100;

  atualizaBarra(lifePercent);

  stage.update();
}
function atualizaBarra(lifePercent) {
  if (lifePercent <= 0.3) {
    $('.percent').addClass('danger');
  }
  $('.percent').css('width', (lifePercent * 100) + "%");
}
document.onkeydown = function(e){
  //console.log(e.keyCode)
  tecla[e.keyCode]=true;
}
document.onkeyup = function(e){
  tecla[e.keyCode]=false;
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
  enimys = new Array();
  player = new plane(500,500,true);
  things.push(player);
  timee=0;
  isPause=true;
}

// $(document).mousemove(function(e){
//       mouseObj.x=e.pageX;
//       mouseObj.y=e.pageY;

//       if(onMove){
//         var px=mouseObj.x-ckX;//(1290-mouseObj.x-50)-defX;
//         var py=mouseObj.y-ckY;//(768-mouseObj.y-50)-defY;
//         var angMove=Math.atan2((py),(px));
//         var hip=Math.sqrt( (px)*(px) + (py)*(py) );
//         if(hip>30)hip=30;
//         px+=Math.cos(angMove)*hip;
//         py+=Math.sin(angMove)*hip;
//         $("#areaControl").css('bottom',(-py-defY+55)+"px");
//         $("#areaControl").css('right',(-px-defX+55)+"px");
//         infX=(px)*0.05;
//         infY=(py)*0.05;
//       }
//    });
