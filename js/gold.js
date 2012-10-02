function gold(nx,ny,v){
  this.base = new createjs.Bitmap(images['goldImg']);
  this.x=nx;
  this.y=ny;
  this.value=v;
  var ang=Math.random()*360;
  var vel=Math.random()*8;
  this.vx=Math.cos(ang)*vel;
  this.vy=Math.sin(ang)*vel;
  things.push(this)
  world.addChild(this.base);

  this.enterFrame=function(){

    this.vx*=0.9;
    this.vy*=0.9;
    this.x += this.vx;
    this.y += this.vy;

    if ((this.x < 0)||(this.x > imgW)||(this.y < 0)||(this.y > imgH)){
      //this.remove();
      //return;
      this.vx*=-1;
      this.vy*=-1;
    }

    var mx=player.x
    var my=player.y
    var distance=Math.sqrt( (mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y) );
    if(distance<180){
      var angPlayer=Math.atan2((my-this.y),(mx-this.x));
      this.vx+=Math.cos(angPlayer)*1;
      this.vy+=Math.sin(angPlayer)*1;
      if(distance<player.radius){
        goldAmount+=this.value;
        this.remove();
        return;
      }
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