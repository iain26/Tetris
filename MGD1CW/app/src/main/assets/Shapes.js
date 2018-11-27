var blocks = [];
var numShapes = 4;

function aSprite(x, y, imageSRC, velx, vely) {
    this.zindex = 0;
    this.x = x;
    this.y = y;
    this.vx = velx;
    this.vy = vely;
    this.sImage = new Image();
    this.sImage.src = imageSRC;
}

function CreateShape(){
    var rand = Math.floor((Math.random() * numShapes) + 1);
    switch(rand){
        case 1:
            blocks.push(new aSprite(0, 0,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(0, 1,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(1, 1,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(2, 1,"RedBlock.png", 0, 0));
            return blocks;
            break;
        case 2:
            blocks.push(new aSprite(0, 0,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(0, 1,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(1, 1,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(1, 2,"RedBlock.png", 0, 0));
            return blocks;
            break;
        case 3:
            blocks.push(new aSprite(0, 0,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(0, 1,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(1, 1,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(1, 0,"RedBlock.png", 0, 0));
            return blocks;
            break;
        case 4:
            blocks.push(new aSprite(0, 0,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(1, 0,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(2, 0,"RedBlock.png", 0, 0));
            blocks.push(new aSprite(3, 0,"RedBlock.png", 0, 0));
            return blocks;
            break;
    }
}