function shoot(nx,ny,pl,ang,v,d){
  if (pl) {
    this.base = new createjs.Bitmap(images['shootImg']);
  } else {
    this.base = new createjs.Bitmap(images['shootPlayerImg']);
  }
  this.x=nx;
  this.y=ny;
  this.damage=d;
  this.vx=Math.cos(ang)*v;
  this.vy=Math.sin(ang)*v;
  this.player=pl;
  things.push(this)
  world.addChild(this.base);

  this.enterFrame=function(){
    if(this.player){
      for (var i = enimies.length - 1; i >= 0; i--) {
        var mx=enimies[i].x
        var my=enimies[i].y
        var distance=Math.sqrt( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) );
        if(distance<enimies[i].radius){
          enimies[i].damage(this.damage);
          this.remove();
          return;
        }
      }
    }else{
      var mx=player.x
      var my=player.y
      var distance=Math.sqrt( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) );
      if(distance<player.radius){
        player.damage(this.damage);
        this.remove();
        return;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    if ((this.x < 0)||(this.x > imgW)||(this.y < 0)||(this.y > imgH)){
      this.remove();
      return;
    }

    this.base.x=this.x;
    this.base.y=this.y;
  }
  this.remove=function(){
    this.base.x=-9999;
    this.base.y=-9999;
    for (var i=0;i<things.length;i++) {
      if(things[i]==this){
        things.splice(i,1);
      }
    }
  }
}