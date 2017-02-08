//*********changewate.cn*********
//webpd

var _w = window.innerWidth;
var _h = window.innerHeight;
var _wHalf = _w / 2;
var _hHalf = _h / 2;
var stage;
var renderer;
var accGravity;

window.addEventListener("DOMContentLoaded", init, false);
function init()
{
    stage = new PIXI.Stage(0x000);
    renderer = PIXI.autoDetectRenderer(_w, _h);
    document.body.appendChild(renderer.view);
    initBg();
    initPd();
    resize();
    requestAnimFrame(update);

    window.addEventListener('orientationchange', resize, false);
    window.addEventListener('resize', resize, false);

    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", motionHandler, false);
    } else {
        document.body.innerHTML = "NO Gravity ";
    }

};




function resize() {
    _w = window.innerWidth;
    _h = window.innerHeight;
    _wHalf = _w / 2;
    _hHalf = _h / 2;

    renderer.resize(_w, _h);
}

function motionHandler(event) {
    accGravity = event.accelerationIncludingGravity;
}



function initBg()
{
    var btn = new PIXI.Sprite(PIXI.Texture.fromImage("pics/bg.png"));
    stage.addChild(btn);
    btn.width = _w;
    btn.height = _h;

    btn.interactive = true;
    btn.buttonMode = true;

    btn.mousedown = btn.touchstart = function(data)
    {
        data.originalEvent.preventDefault();
        this.data = data;
        this.alpha = 0.9;
    };
    btn.mouseup = btn.mouseupoutside = btn.touchend = btn.touchendoutside = function(data)
    {
        this.alpha = 1;
        var newPosition = this.data.getLocalPosition(this.parent);
        addPoint(newPosition.x,newPosition.y);
        this.data = null;
    };



    addNode(_wHalf,_h/3,1);
    addNode(_wHalf,_h*2/3,2);

}


var Nodes=[];
function addNode(_x,_y,_type)
{
    var n = new TYnode(_type);
    n.position.x=_x;
    n.position.y=_y;
    stage.addChild(n);
    Nodes.push(n);
}


var Points=[];
function addPoint(_x,_y)
{
    var _type= Math.floor(_x/(_w/7))+1;
    var p = new TYpoint(_type);
    p.position.x=_x;
    p.position.y=_y;
    stage.addChild(p);
    Points.push(p);
}

var basePatch;
function initPd()
{
    $.get('base.pd', function(patchFile) {
        basePatch = Pd.compat.parse(patchFile);
        basePatch.play();
    });

}

function playSound(_type,_val)
{
    if(_type==0) basePatch.send('node', _val*6+60);
    if(_type==1) basePatch.send('base', _val*30);

    basePatch.send('ll', distance(Nodes[0], Nodes[1])/_h*100);
}



function update() {
    requestAnimFrame(update);
    renderer.render(stage);


    for(var i=0;i<Points.length;i++)
    {
        for(var j=0;j<Nodes.length;j++)
        {
            var d1 = distance(Points[i], Nodes[j]);
            var d2 = Math.abs(Nodes[j].r - d1);
            if (d2 < Nodes[j].speed)
            {
                playSound(j,Points[i].type-d1/60);

                Points[i].flash();
            }
        }
    }
}


function distance(p1, p2)
{
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;
    return Math.sqrt(a * a + b * b);
};
