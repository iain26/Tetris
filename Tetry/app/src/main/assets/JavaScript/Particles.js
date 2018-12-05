var particles = [];

function createParticleArray(xPos, yPos, theCanvasContext)
{
    for(var i = 0; i < 5; i++)
    {
        particles.push(new create(xPos, yPos));
    }
    renderP(theCanvasContext);
}

function create(startX, startY)
{
    this.x = Math.random()*startX;
    this.y = startY;

    this.vx = Math.random()*10-5;
    this.vy = -Math.random()*7+2;

    var rand =  Math.floor(Math.random()*3);
    var red = 0;
    var green = 255;
    var blue = 0;
    switch(rand){
        case 0:
            red = 255;
            green = 0;
            blue = 0;
            break;
        case 1:
            red = 0;
            green = 255;
            blue = 0;
            break;
        case 2:
            red = 0;
            green = 0;
            blue = 255;
            break;
    }
    this.color = "rgba("+red+", "+green+", "+blue+", 0.5)";

    this.radius = canvas.width*0.01;
}

function renderP(theCanvasContext)
{
    var aCanvasContext = theCanvasContext;
    for(var t = 0; t < particles.length; t++)
    {
        var p = particles[t];
        if(p != null){
            aCanvasContext.beginPath();

            var gradient = aCanvasContext.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            gradient.addColorStop(0, p.color);
            var prev = aCanvasContext.fillStyle;
            aCanvasContext.fillStyle = gradient;
            aCanvasContext.arc(p.x, p.y, p.radius, Math.PI*2, false);
            aCanvasContext.fill();
            aCanvasContext.fillStyle = prev;

            p.x += p.vx;
            p.y += p.vy;
        }
    }
}