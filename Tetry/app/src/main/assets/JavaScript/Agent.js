var desired = {left: -1, right: 1, NA: 0};
var newDir;
var aimX;
var completeRun = false;
var attributes = {GAPS: 0, DELETE: 0, HEIGHT: 0, BUMP: 0};

var env = {};
var agent;


function genAlgorithm() {
//    env.getNumStates = function (){ return xGridAmount * yGridAmount;};
//    env.getMaxNumActions = function (){ return 2;};
   
//     var spec = { alpha: 0.01 }
//     agent = new RL.DQNAgent(env, spec);

    // setInterval(function(){ // start the learning loop
    //     var action = agent.act(s); // s is an array of length 8
    //     // execute action in environment and get the reward
    //     agent.learn(reward); // the agent improves its Q,policy,model, etc. reward is a float
    // }, 0);
   
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
        currentY = -2;
        aimX = target();
    }
    if(completeRun == true){
        points = {xPos: 0, h: 0};
        if(currentX > aimX){
            newDir = desired.left;
        }
        else if(currentX < aimX){
            newDir = desired.right;
        }
        else if(currentX == aimX){
            newDir = desired.NA;
            aimX = null;
        }
    }
    conInput(newDir);
}

var move = {x: 0, y: 0};

function conInput(dir){
    move = {x: gridCellX[BlockGridPosX[0]]  + (canvas.width * dir), y:0};
    moveShape(move);
}

var points = {xPos: 0, h: 0};

function target(){
    var temp = {GAPS: 0, DELETE: 0, HEIGHT: 0, BUMP: 0};
    var h = 0;
    for (var i = 0; i < shape.length; i++) {
        if (ghostCurrentY + BlockShapePosY[i] - lowestY == yGridAmount - 1)
        {
            h += 1;
        }
        if(ghostCurrentY + BlockShapePosY[i] - lowestY != yGridAmount -1){
            if(surfaceBlock[(BlockGridPosX[i])][ghostCurrentY + BlockShapePosY[i] - lowestY + 1] == null){
                temp.GAPS -= 0.1;
            }
        }

        var right = (BlockGridPosX[i]) + 1;
        var left = (BlockGridPosX[i]) - 1;

        if(right < xGridAmount){
            if(surfaceBlock[right][ghostCurrentY + BlockShapePosY[i] - lowestY] == null){
                temp.GAPS += 0.2;
            }
        }
        if(left >= 0){
            if(surfaceBlock[left][ghostCurrentY + BlockShapePosY[i] - lowestY] == null){
                temp.GAPS += 0.2;
            }
        }
    }
    
    // for(var y = yGridAmount - 1; y >= 0; y--){
    //     var lineAmount = 0;
    //     for(x = 0; x < xGridAmount; x++){
    //         if(surfaceBlock[x][y] != null){
    //             lineAmount ++;
    //         }
    //     }
    //     if(lineAmount == xGridAmount){
    //         temp.DELETE ++;
    //     }
    // }

    var columnHeight = [];

    for(var x = 0; x < xGridAmount; x++){
        var height = 0;
        for(var y = yGridAmount - 1; y >= 0; y--){
            if(surfaceBlock[x][y] != null){
                height++;
            }
        }
        columnHeight.push(height);
    }
    const aggregate = (a, c) => a + c;
    temp.HEIGHT = (columnHeight.reduce(aggregate)) * -0.1;

    // var bump = 0;
    // for(var i = 0; i < columnHeight.length; i++){
    //     if(i < columnHeight.length -1 ){
    //         bump += Math.abs(columnHeight[i+1] - columnHeight[i]); 
    //     }
    // }
    // bump *= -0.1;
    // temp.BUMP = bump

    // var h += temp.GAPS + temp.DELETE + temp.HEIGHT + temp.BUMP;
    // print(h)

    if(h >= points.h){
        points = {xPos: currentX, h: h};
    }
    return points.xPos;
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