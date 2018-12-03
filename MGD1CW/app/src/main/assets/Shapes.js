var numShapes = 7;

function aSprite(x, y, imageSRC, velx, vely) {
    this.zindex = 0;
    this.x = x;
    this.y = y;
    this.vx = velx;
    this.vy = vely;
    this.sImage = new Image();
    this.sImage.src = imageSRC;
}

function block(x, y, imageSRC, velx, vely) {
    this.zindex = 0;
    this.x = x;
    this.y = y;
    this.vx = velx;
    this.vy = vely;
    this.sImage = new Image();
    this.sImage.src = imageSRC;
}

function CreateShape(){
    var blocks = [];
    var rand = Math.floor((Math.random() * numShapes) + 1);
    switch(rand){
        case 1:
            // J Shape
            blocks.push(new block(0, 0,"BlueBlock.png", 0, 0));
            blocks.push(new block(0, 1,"BlueBlock.png", 0, 0));
            blocks.push(new block(1, 1,"BlueBlock.png", 0, 0));
            blocks.push(new block(2, 1,"BlueBlock.png", 0, 0));
            return blocks;
            break;
        case 2:
            // L Shape
            blocks.push(new block(0, 1,"OrangeBlock.png", 0, 0));
            blocks.push(new block(1, 1,"OrangeBlock.png", 0, 0));
            blocks.push(new block(2, 1,"OrangeBlock.png", 0, 0));
            blocks.push(new block(2, 0,"OrangeBlock.png", 0, 0));
            return blocks;
            break;
        case 3:
            // Z Shape
            blocks.push(new block(0, 0,"RedBlock.png", 0, 0));
            blocks.push(new block(1, 0,"RedBlock.png", 0, 0));
            blocks.push(new block(1, 1,"RedBlock.png", 0, 0));
            blocks.push(new block(2, 1,"RedBlock.png", 0, 0));
            return blocks;
            break;
        case 4:
            // S Shape
            blocks.push(new block(0, 1,"BrownBlock.png", 0, 0));
            blocks.push(new block(1, 1,"BrownBlock.png", 0, 0));
            blocks.push(new block(1, 0,"BrownBlock.png", 0, 0));
            blocks.push(new block(2, 0,"BrownBlock.png", 0, 0));
            return blocks;
            break;
        case 5:
            // O Shape
            blocks.push(new block(0, 0,"YellowBlock.png", 0, 0));
            blocks.push(new block(0, 1,"YellowBlock.png", 0, 0));
            blocks.push(new block(1, 1,"YellowBlock.png", 0, 0));
            blocks.push(new block(1, 0,"YellowBlock.png", 0, 0));
            return blocks;
            break;
        case 6:
            // I Shape 
            blocks.push(new block(0, 0,"CyanBlock.png", 0, 0));
            blocks.push(new block(1, 0,"CyanBlock.png", 0, 0));
            blocks.push(new block(2, 0,"CyanBlock.png", 0, 0));
            blocks.push(new block(3, 0,"CyanBlock.png", 0, 0));
            return blocks;
            break;
        case 7:
            // T Shape 
            blocks.push(new block(0, 1,"MagentaBlock.png", 0, 0));
            blocks.push(new block(1, 1,"MagentaBlock.png", 0, 0));
            blocks.push(new block(1, 0,"MagentaBlock.png", 0, 0));
            blocks.push(new block(2, 1,"MagentaBlock.png", 0, 0));
            return blocks;
            break;
        }
    }

function createGhostShape(xPos){
    var ghostBlocks = [];
    ghostBlocks.push(new block(0, 0,"GreyBlock.png", 0, 100));
    ghostBlocks.push(new block(0, 0,"GreyBlock.png", 0, 100));
    ghostBlocks.push(new block(0, 0,"GreyBlock.png", 0, 100));
    ghostBlocks.push(new block(0, 0,"GreyBlock.png", 0, 100));
    return ghostBlocks;
}