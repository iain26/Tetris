var desired = {left: -1, right: 1, NA: 0};
var newDir;
var aimX;
var completeRun = false;
var att = {GAPS: -1, DELETE: 1, HEIGHT: -1, BUMP: -1};

var tempSurface = [];

// var env = {};
// var agent;


function renAlgo() {
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

        tempSurface.length = 0;
        for (var x = 0; x < xGridAmount; x++) {
            tempSurface[x] = new Array(yGridAmount);
            for (var y = 0; y < yGridAmount; y++) {
                if(surfaceBlock[x][y] != null){
                    tempSurface[x][y] = true;
                }
                else {
                    tempSurface[x][y] = false;
                }
            }
        }
        for (var i = 0; i < shape.length; i++) {
            tempSurface[BlockShapePosX[i]][ghostCurrentY + BlockShapePosY[i] - lowestY] = true;
        }

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
        // aimX = reward();
        aimX = 5;
        // var ehhh = reward();
    }
    if(completeRun == true){
        if(currentX > aimX){
            newDir = desired.left;
        }
        else if(currentX < aimX){
            newDir = desired.right;
        }
        else if(currentX == aimX){
            newDir = desired.NA;
            aimX = null;
            print(tempSurface);
        }
    }
    conInput(newDir);
}

var move = {x: 0, y: 0};

function conInput(dir){
    move = {x: gridCellX[BlockGridPosX[0]]  + (canvas.width * dir), y:0};
    moveShape(move);
}

var highestReward = null;

function utility(){

}

function lowYCheck(arr){
    for(var i =0; i < arr.length; i++){
        
    }
}

function reward(){
    var temp = {GAPS: 0, DELETE: 0, HEIGHT: 0, BUMP: 0};

    // ghost points
    var ghostPos = [{x: null, y: null}];
    for (var i = 0; i < shape.length; i++) {
        var tempPos = {x: BlockShapePosX[i], y: ghostCurrentY + BlockShapePosY[i] - lowestY};
        ghostPos.push(tempPos);
    }
    // print(ghostPos);

    // Gaps
    for (var i = 0; i < shape.length; i++) {

        // var right = (BlockGridPosX[i]) + 1;
        // var left = (BlockGridPosX[i]) - 1;

        // if(ghostCurrentY + BlockShapePosY[i] - lowestY != yGridAmount -1){
        //     // if()
        //     {
        //         if(surfaceBlock[(BlockGridPosX[i])][ghostCurrentY + BlockShapePosY[i] - lowestY + 1] == null){
        //             print(" Gap Below " + i);
        //             temp.GAPS -= 0.2;
        //         }
        //     }
        // }

        // if(right < xGridAmount){
        //     if(surfaceBlock[right][ghostCurrentY + BlockShapePosY[i] - lowestY] == null){
        //         temp.GAPS -= 0.1;
        //     }
        // }

        // if(left >= 0){
        //     if(surfaceBlock[left][ghostCurrentY + BlockShapePosY[i] - lowestY] == null){
        //         temp.GAPS -= 0.1;
        //     }
        // }
    }
    
    // lines
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

    // // aggregate height
    var columnHeight = [];

    for(var x = 0; x < xGridAmount; x++){
        var height = 0;
        for(var y = yGridAmount - 1; y >= 0; y--){
            if(tempSurface[x][y] != false ){
                height = yGridAmount - y;
            }
        }
        columnHeight.push(height);
    }
    const aggregate = (a, c) => a + c;
    temp.HEIGHT = (columnHeight.reduce(aggregate));

    // print(temp.HEIGHT)

    // bump
    // var bump = 0;

    // for(var i = 0; i < columnHeight.length; i++){
    //     if(i < columnHeight.length -1 ){
    //         bump += Math.abs(columnHeight[i+1] - columnHeight[i]); 
    //     }
    // }
    // temp.BUMP = bump

    // determine highest reward
    var h = (att.GAPS * temp.GAPS) + (att.DELETE * temp.DELETE)
     + (att.BUMP * temp.HEIGHT) + (att.BUMP * temp.BUMP);
    if(h >= highestReward || highestReward == null){
        highestReward =  h;
        return currentX;
    }
    return aimX;
}

var points = 0;

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