var numShapes = 7;
var rand = 1;

function nextShapeDisplay(){
    switch(rand){
        case 1:
            // J Shape
            return new image(0, 0,"J.png", 0, 0);
            break;
        case 2:
            // L Shape
            return new image(0, 0,"L.png", 0, 0);
            break;
        case 3:
            // Z Shape
            return new image(0, 0,"Z.png", 0, 0);
            break;
        case 4:
            // S Shape
            return new image(0, 0,"S.png", 0, 0);
            break;
        case 5:
            // O Shape
            return new image(0, 0,"O.png", 0, 0);
            break;
        case 6:
            // I Shape
            return new image(0, 0,"I.png", 0, 0);
            break;
        case 7:
            // T Shape
            return new image(0, 0,"T.png", 0, 0);
            break;
        }
}

function CreateShape(){
    var blocks = [];
    switch(rand){
        case 1:
            // J Shape
            blocks.push(new image(0, 0,"BlueBlock.png", 0, 0));
            blocks.push(new image(0, 1,"BlueBlock.png", 0, 0));
            blocks.push(new image(1, 1,"BlueBlock.png", 0, 0));
            blocks.push(new image(2, 1,"BlueBlock.png", 0, 0));
            break;
        case 2:
            // L Shape
            blocks.push(new image(0, 1,"OrangeBlock.png", 0, 0));
            blocks.push(new image(1, 1,"OrangeBlock.png", 0, 0));
            blocks.push(new image(2, 1,"OrangeBlock.png", 0, 0));
            blocks.push(new image(2, 0,"OrangeBlock.png", 0, 0));
            break;
        case 3:
            // Z Shape
            blocks.push(new image(0, 0,"RedBlock.png", 0, 0));
            blocks.push(new image(1, 0,"RedBlock.png", 0, 0));
            blocks.push(new image(1, 1,"RedBlock.png", 0, 0));
            blocks.push(new image(2, 1,"RedBlock.png", 0, 0));
            break;
        case 4:
            // S Shape
            blocks.push(new image(0, 1,"BrownBlock.png", 0, 0));
            blocks.push(new image(1, 1,"BrownBlock.png", 0, 0));
            blocks.push(new image(1, 0,"BrownBlock.png", 0, 0));
            blocks.push(new image(2, 0,"BrownBlock.png", 0, 0));
            break;
        case 5:
            // O Shape
            blocks.push(new image(0, 0,"YellowBlock.png", 0, 0));
            blocks.push(new image(0, 1,"YellowBlock.png", 0, 0));
            blocks.push(new image(1, 1,"YellowBlock.png", 0, 0));
            blocks.push(new image(1, 0,"YellowBlock.png", 0, 0));
            break;
        case 6:
            // I Shape
            blocks.push(new image(0, 0,"CyanBlock.png", 0, 0));
            blocks.push(new image(1, 0,"CyanBlock.png", 0, 0));
            blocks.push(new image(2, 0,"CyanBlock.png", 0, 0));
            blocks.push(new image(3, 0,"CyanBlock.png", 0, 0));
            break;
        case 7:
            // T Shape
            blocks.push(new image(0, 1,"MagentaBlock.png", 0, 0));
            blocks.push(new image(1, 1,"MagentaBlock.png", 0, 0));
            blocks.push(new image(1, 0,"MagentaBlock.png", 0, 0));
            blocks.push(new image(2, 1,"MagentaBlock.png", 0, 0));
            break;
        }
        rand = Math.floor((Math.random() * numShapes) + 1);
        return blocks;
    }

function createGhostShape(xPos){
    var ghostBlocks = [];
    ghostBlocks.push(new image(0, 0,"GreyBlock.png", 0, 100));
    ghostBlocks.push(new image(0, 0,"GreyBlock.png", 0, 100));
    ghostBlocks.push(new image(0, 0,"GreyBlock.png", 0, 100));
    ghostBlocks.push(new image(0, 0,"GreyBlock.png", 0, 100));
    return ghostBlocks;
}