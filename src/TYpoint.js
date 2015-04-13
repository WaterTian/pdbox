TYpoint=function(type)
{
    PIXI.DisplayObjectContainer.call( this );
    var self=this;

    self.type=type;
    var pTexture = PIXI.Texture.fromImage("pics/ball" + type + ".png");
    var p = new PIXI.Sprite(pTexture);
    p.anchor.x = 0.5;
    p.anchor.y = 0.5;
    p.width= p.height=30;
    p.alpha=0.4;
    self.addChild(p);

    self.flash=function()
    {
        p.width= p.height=40;
        p.alpha=1;
        TweenMax.to(p, 0.6, { alpha: 0.4,width:30,height:30});
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
        }
    }


}
TYpoint.prototype = Object.create( PIXI.DisplayObjectContainer.prototype);
TYpoint.prototype.constructor = TYpoint;