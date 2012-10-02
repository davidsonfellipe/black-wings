
function plane(xx,yy,p){
  this.player=p
  if(this.player){
    var spriteSheet = new createjs.SpriteSheet({
        images: [images['baseplane']],
        frames: {width: 150, height: 150, regX: 75, regY: 75},
        animations:{
            baseRotation: [0, 8, "baseRotation",3]
        }
    });

    this.base = new createjs.BitmapAnimation(spriteSheet);
    this.target = mouseObj;
    this.vel = 4;
    this.range = 50;
    this.life=playerMaxLife;
    this.fireRate=15;
  }else{
    switch(Math.floor(Math.random()*3)){
      case 0:this.base = new createjs.Bitmap(images['baseplaneEnimy1']);break;
      case 1:this.base = new createjs.Bitmap(images['baseplaneEnimy2']);break;
      case 2:this.base = new createjs.Bitmap(images['baseplaneEnimy3']);break;
    }

    this.target = player;
    this.vel = 2;
    this.life=50;
    this.range = 450;
    this.fireRate=15;
  }
  this.time=0
  this.x=xx;
  this.y=yy;
  this.vx=0;
  this.vy=0;
  this.radius=60;
  world.addChild(this.base);

  this.enterFrame=function(){
    this.time++;
    if(this.player){
      var angleMove=Math.atan2((infY),(infX));
      var hip=Math.sqrt( (infX)*(infX) + (infY)*(infY) );
      this.vx+=Math.cos(angleMove)*hip;
      this.vy+=Math.sin(angleMove)*hip;
      var enimy=enimies[0];
      var minEnimyDistance=99999999;
      for (var i = enimies.length - 1; i >= 1; i--) {
        var mx=enimies[i].x;
        var my=enimies[i].y;
        var distance=Math.sqrt( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) );
        if(distance<minEnimyDistance){
          minEnimyDistance=distance;
          enimy=enimies[i];
        }
      }
      if(this.time>this.fireRate && enimy){
        this.time=0;
        var angleShoot=Math.atan2((enimy.y-this.y),(enimy.x-this.x));
        new shoot(this.x,this.y,true,angleShoot,14,10);
      }
    }else{
      var mx=this.target.x;
      var my=this.target.y;
      var distanceTarget=Math.sqrt( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) );
      var force=distanceTarget;
      if(force>200)force=200;
      force=(force/200)*this.vel;
      var angleMove=Math.atan2((my-this.y),(mx-this.x));

      if(distanceTarget>this.range){
        this.vx+=Math.cos(angleMove)*force;
        this.vy+=Math.sin(angleMove)*force;
      }else{
        if(this.time>this.fireRate){
          this.time=0;
          new shoot(this.x,this.y,false,angleMove,14,5);
        }
      }
    }
    this.vx*=0.85;
    this.vy*=0.85;
    if(this.player){
      var ang=Math.atan2((this.vy),(this.vx));
      ang+=Math.PI*(1.5+0.125);
      if(ang<0)ang+=(Math.PI*2);
      var frame=Math.floor((ang/(Math.PI*2))*8);
      if(frame==8)frame=0;
      this.base.gotoAndStop(frame);
    }
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < this.radius) this.x = this.radius;
    if (this.x > 1420-this.radius) this.x = 1420-this.radius;
    if (this.y < this.radius) this.y = this.radius;
    if (this.y > 1100-this.radius) this.y = 1100-this.radius;
    if(this.player){
      this.base.x=this.x;
      this.base.y=this.y;
    }else{
      this.base.x=this.x-75;
      this.base.y=this.y-75;
    }
  }
  this.damage=function(v){
    this.life-=v;
    if(this.life<0){
      if(this.player){
        endGame();
      }else{
        score+=10;
        var n=Math.random()*5+8;
        for(var l=0;l<n;l++){
          new gold(this.x,this.y,10);
        }
        if(Math.random()<0.3){
          new heal(this.x,this.y,15);
        }
      }
      this.remove();
      return;
    }else{
      var tt=this
      this.base.alpha=0.5
      setTimeout(function(){tt.base.alpha=1},50)
    }
  }
  this.remove=function(){
    this.base.x=888888;
    this.base.y=888888;
    for (var i=0;i<things.length;i++) {
      if(things[i]==this){
        things.splice(i,1);
      }
    }
    for (i=0;i<enimies.length;i++) {
      if(enimies[i]==this){
        enimies.splice(i,1);
      }
    }
  }
}
