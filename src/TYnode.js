TYnode=function(type)
{
    PIXI.DisplayObjectContainer.call( this );
    var self=this;

    self.type=type;
    var ballTexture = PIXI.Texture.fromImage("pics/node"+type+".png");
    var ball = new PIXI.Sprite(ballTexture);
    ball.anchor.x = 0.5;
    ball.anchor.y = 0.5;
    self.addChild(ball);

    self.line = new PIXI.Graphics();
    self.addChild(self.line);

    self.r=10;
    self.area=400;
    self.speed=3;
    requestAnimFrame(animate);

    function animate() {

        self.line.clear();

        self.r += self.speed;
        if(self.r>self.area)self.r=0;

        self.line.clear();
        self.line.lineStyle(4, 0xffffff, (self.area-self.r)/self.area);
        self.line.drawCircle(0, 0,self.r);
        requestAnimFrame( animate );
    }


    self.interactive = true;
    self.buttonMode = true;
    self.mousedown = self.touchstart = function(data)
    {
        data.originalEvent.preventDefault();

        this.data = data;
        this.alpha = 0.9;
        this.dragging = true;
    };
    self.mouseup = self.mouseupoutside = self.touchend = self.touchendoutside = function(data)
    {
        this.alpha = 1
        this.dragging = false;
        this.data = null;

        this.speed= (this.position.y/window.innerHeight)*8+1;
    };
    self.mousemove = self.touchmove = function(data)
    {
        if(this.dragging)
        {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.position.x = newPosition.x;
            this.position.y = newPosition.y;

            this.speed= (this.position.y/window.innerHeight)*8+1;
        }
    }


}
TYnode.prototype = Object.create( PIXI.DisplayObjectContainer.prototype);
TYnode.prototype.constructor = TYnode;