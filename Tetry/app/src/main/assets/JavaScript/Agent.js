var desired = {left: -1, right: 1, NA: 0};
var newDir;
var aimX;
var completeRun = false;

function genAlgorithm() {
    currentY = 0;
    if(agentNewShape == true){
        completeRun = false;
    }
    if(completeRun == false){
        if(agentNewShape == true){
            agentNewShape = false;
            newDir = desired.left;
        }
        if(currentX <  1){
            newDir = desired.right;
        }
        if(currentX == xGridAmount - (highestX - lowestX + 1)){
            completeRun = true;
        }
        aimX = target();
    }
    if(completeRun == true){
        points = {xPos: 0, p: 0};
        if(currentX > aimX){
            newDir = desired.left;
        }
        else if(currentX < aimX){
            newDir = desired.right;
        }
        else if(currentX == aimX){
            newDir = desired.NA;
        }
    }
    conInput(newDir);
}

var move = {x: 0, y: 0};

function conInput(dir){
    move = {x: gridCellX[BlockGridPosX[0]]  + (canvas.width * dir), y:0};
    moveShape(move);
}

var points = {xPos: 0, p: 0};

function target(){
    var tempPoints = 0;
    
    for (var i = 0; i < shape.length; i++) {
        if (ghostCurrentY + BlockShapePosY[i] - lowestY == yGridAmount - 1)
        {
            tempPoints += 100;
        }
        if(surfaceBlock[(BlockGridPosX[i])][ghostCurrentY + BlockShapePosY[i] - lowestY + 1] == null){
            tempPoints -= 50;
        }
        var lineAmount = 0;
        for(i = 0; i < xGridAmount; i++){
            if(surfaceBlock[i][ghostCurrentY + BlockShapePosY[i] - lowestY]){
                lineAmount ++;
            }
        }
        tempPoints *= (lineAmount + 1);
        // if((BlockGridPosX[i] + 1) < xGridAmount){
        //     if(surfaceBlock[(BlockGridPosX[i] + 1)][ghostCurrentY + BlockShapePosY[i] - lowestY] == null){
        //         tempPoints -= 50;
        //     }
        //     else{
        //         print("sideLeft");
        //     }
        // }
        // if((BlockGridPosX[i] - 1) >= 0){
        //     if(surfaceBlock[(BlockGridPosX[i] - 1)][ghostCurrentY + BlockShapePosY[i] - lowestY] == null){
        //         tempPoints -= 50;
        //     }
        // }
    }

    if(tempPoints > points.p){
        points = {xPos: currentX, p: tempPoints};
    }
    return points.xPos;

    for (var i = 0; i < shape.length; i++) {
        if((BlockShapePosX[i]) + x < xGridAmount){
            if (ghostCurrentY + BlockShapePosY[i] - lowestY == yGridAmount - 1)
            {
                tempPoints += 1000;
            }
            if (ghostCurrentY + BlockShapePosY[i] - lowestY + 1 <= yGridAmount - 1){
                if(surfaceBlock[(BlockShapePosX[i]) + x][ghostCurrentY + BlockShapePosY[i] - lowestY + 1] != null){
                    tempPoints -= 100;
                }
            }
        }
        else{
            return "out";
        }
    }
    return 0;
}


function evaluateMove(typeOfScoreAdd){
    switch(typeOfScoreAdd){
        case "line":
            score += 1000;
            points += 1000;
            break;
        case "ground":
            points += 100;
            break;
        case "stack":
            points -= 100;
            break;
        case "space side":
            points -= 25;
            break;
        case "space below":
            points -= 50;
            break;
        case "over":
            points -= 10000;
            break;
    }
}

function checkPossiblePlacements(x){
    var tempPoints = 0;
    for (var i = 0; i < shape.length; i++) {
        if((BlockShapePosX[i]) + x < xGridAmount){
            if (ghostCurrentY + BlockShapePosY[i] - lowestY == yGridAmount - 1)
            {
                tempPoints += 1000;
            }
            if (ghostCurrentY + BlockShapePosY[i] - lowestY + 1 <= yGridAmount - 1){
                if(surfaceBlock[(BlockShapePosX[i]) + x][ghostCurrentY + BlockShapePosY[i] - lowestY + 1] != null){
                    tempPoints -= 100;
                }
            }
        }
        else{
            return "out";
        }
    }
    return tempPoints;
}

function runAgent(){
    if(agentNewShape)
    {
        var aimX;
        var pointX = -100000;
        for (var x = 0; x < xGridAmount; x++) {
            var tempPointX = checkPossiblePlacements(x);
            if(tempPointX != "out"){
                if(tempPointX > pointX){
                    pointX = tempPointX;
                    aimX = x;
                }
            }
        }
        currentX = aimX;
        agentNewShape = false;
    }

}