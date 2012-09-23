
function plane(xx,yy,p){
  this.player=p
  if(this.player){
    this.base = new createjs.BitmapAnimation(spriteSheets["Base"]);
    this.target = mouseObj;
    this.vel = 4;
    this.range = 50;
    this.life=100;
    this.fireRate=15;
  }else{
    switch(Math.floor(Math.random()*3)){
      case 0:this.base = new createjs.Bitmap(baseplaneEnimy1);break;
      case 1:this.base = new createjs.Bitmap(baseplaneEnimy2);break;
      case 2:this.base = new createjs.Bitmap(baseplaneEnimy3);break;
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
  this.active=true;
  this.radius=60;
  world.addChild(this.base);

  this.enterFrame=function(){
    if(!this.active)return
    this.time++;
    if(this.player){
      var angMove=Math.atan2((infY),(infX));
      var hip=Math.sqrt( (infX)*(infX) + (infY)*(infY) );
      var force=hip;
      this.vx+=Math.cos(angMove)*force;
      this.vy+=Math.sin(angMove)*force;
      var eni=enimys[0];
      var minEni=99999999;
      for (var i = enimys.length - 1; i >= 0; i--) {
        if(enimys[i].active){
          var mx=enimys[i].x
          var my=enimys[i].y
          var hipp=Math.sqrt( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) );
          if(hipp<minEni){
            minEni=hipp;
            eni=enimys[i];
          }
        }
      }
      if(this.time>this.fireRate){
        this.time=0;
        var angS=Math.atan2((eni.y-this.y),(eni.x-this.x));
        new shoot(this.x,this.y,true,angS,14,10);
      }
    }else{
      var mx=this.target.x;
      var my=this.target.y;
      var hip=Math.sqrt( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) );
      var force=hip;
      if(hip>200)force=200;
      force=(force/200)*this.vel;
      var angMove=Math.atan2((my-this.y),(mx-this.x));

      if(hip>this.range){
        this.vx+=Math.cos(angMove)*force;
        this.vy+=Math.sin(angMove)*force;
      }else{
        if(this.time>this.fireRate){
          this.time=0;
          new shoot(this.x,this.y,false,angMove,14,5);
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
      this.x=888888;
      this.y=888888;
      this.base.x=888888;
      this.base.y=888888;
      this.active=false;
      if(this.player){
        endGame();
      }else{
        score+=10;
      }
    }else{
      var tt=this
      this.base.alpha=0.5
      setTimeout(function(){tt.base.alpha=1},100)
    }
  }
}
