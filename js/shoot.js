function shoot(nx,ny,pl,ang,v,d){

  if (pl) {
    this.base = new createjs.Bitmap(shootImg);
  } else {
    this.base = new createjs.Bitmap(shootPlayerImg);
  }

  this.x=nx;
  this.y=ny;
  this.damage=d;
  this.active=true
  this.vx=Math.cos(ang)*v;
  this.vy=Math.sin(ang)*v;
  this.player=pl;
  things.push(this)
  world.addChild(this.base);

  this.enterFrame=function(){
    if(!this.active)return
    if(this.player){
      for (var i = enimys.length - 1; i >= 0; i--) {
        if(enimys[i].active){
          var mx=enimys[i].x
          var my=enimys[i].y
          var hipp=Math.sqrt( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) );
          if(hipp<enimys[i].radius){
      this.active=false;
        this.x=-9999;
        this.y=-9999;
        this.base.x=this.x;
        this.base.y=this.y;
        enimys[i].damage(this.damage);
          }
        }
      }
    }else{
    var mx=player.x
    var my=player.y
    var hipp=Math.sqrt( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) );
    if(hipp<player.radius){
      this.active=false;
        this.x=-9999;
        this.y=-9999;
        this.base.x=this.x;
        this.base.y=this.y;
        player.damage(this.damage);
    }
    }

    this.x += this.vx;
    this.y += this.vy;

    if ((this.x < 0)||(this.x > imgW)||(this.y < 0)||(this.y > imgH)){
      this.active=false;
      this.x=-9999;
      this.y=-9999;
    }

    this.base.x=this.x;
    this.base.y=this.y;
  }
}