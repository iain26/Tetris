var xGridAmount = 10;
var yGridAmount = 26;

var spawnPos = 0;

var playing = true;

//time in seconds between updates
var timeStep = 0.3;
var originalTimeStep;
var previousTime = 0;
var time = 0;
var incrementing = false;

var hardPlacement = false;

var level = 1;
var score = 0;

var gridCellX = [];
var gridCellY = [];
var gridCellOccupied = [];

var shape = [];
var ghostShape = [];

var nextShape;

var BlockShapePosX = [];
var BlockShapePosY = [];

var lowestX = 0;
var highestX = 0;
var lowestY = 0;
var highestY = 0;

var BlockGridPosX = [];
var BlockGridPosY = [];

var surfaceBlock = [];

var lineCounter = 0;

var currentX = 0;
var currentY = 0;

var currentChangeX = 0;

var ghostCurrentY = yGridAmount - 1;

var particleG = 0.05;

function startGame(){
    initialiseGame();
}

function initialiseGame() {
    reset();
    if (canvas.getContext)
    {
        originalTimeStep = timeStep;

        spawnPos = Math.floor(xGridAmount/2) - 2;
        currentX = spawnPos;

        var gridYCentre = getGridHeight() / 2;

        for (var x = 0; x < xGridAmount; x++) {
            gridCellX.push(((getGridWidth() * x)));
        }
        for (var y = 0; y < yGridAmount; y++) {
            gridCellY.push(((getGridHeight() * y)));
        }

        for (var x = 0; x < xGridAmount; x++) {
            gridCellOccupied[x] = new Array(yGridAmount);
            surfaceBlock[x] = new Array(yGridAmount);

            for (var y = 0; y < yGridAmount; y++) {
                gridCellOccupied[x][y] = false;
                surfaceBlock[x][y] = null;
            }
        }

        backgroundImage = new image(0, 0, "grey-background.jpg", 0, 0);
        headerImage = new image(0, 0, "Header.png", 0, 0);
        styleText('white', '30px Courier New', 'left', 'middle');

        createNewShape();
    }
    gameLoop();
}

function getGridWidth(){
    return canvas.width/xGridAmount;
}

function getGridHeight(){
    return canvas.height/yGridAmount;
}

function timeStepUpdate() {
    if (incrementing == false) {
        incrementing = true;
        setTimeout(function () {
            time += 1;
            incrementing = false;
            }, timeStep * 1000);
    }
}

function gameLoop() {
    timeStepUpdate();
    placementCheck();
    update();
    ghost();
    checkLine();
    renderGame();
    if(playing == true){
        requestAnimationFrame(gameLoop);
    }
    else{
        stopGame();
    }
}

function reset(){
    xGridAmount = 10;
    yGridAmount = 26;
    spawnPos = 0;
    playing = true;
    timeStep = 0.3;
    originalTimeStep;
    previousTime = 0;
    time = 0;
    incrementing = false;
    hardPlacement = false;
    level = 1;
    score = 0;
    gridCellX.length = 0;
    gridCellY.length = 0;
    gridCellOccupied.length = 0;
    shape.length = 0;
    ghostShape.length = 0;
    nextShape = null;
    BlockShapePosX.length = 0;
    BlockShapePosY.length = 0;
    lowestX = 0;
    highestX = 0;
    lowestY = 0;
    highestY = 0;
    BlockGridPosX.length = 0;
    BlockGridPosY.length = 0;
    surfaceBlock.length = 0;
    lineCounter = 0;
    currentX = 0;
    currentY = 0;
    currentChangeX = 0;
    ghostCurrentY = yGridAmount - 1;
    particles.length = 0;
}

function ghost(){
    var surfaceX = [];
    var surfaceY = [];
    for (var x = (lowestX + currentX); x <= (highestX + currentX); x++) {
        for (var y = (highestY + currentY); y < yGridAmount; y++) {
            if(surfaceBlock[x][y] != null ){
                surfaceX.push(x);
                surfaceY.push(y);
            }
        }
    }
    if(surfaceY.length == 0){
        ghostCurrentY = yGridAmount - 1;
    }
    else{
        ghostCurrentY = Math.min(...surfaceY);
    }
    var counter = 0;
    for (var i = 0; i < shape.length; i++) {
        if(BlockShapePosY[i] == 0 && lowestY - highestY > 1){
            counter++;
        }
    }
    if(counter == 2 && ghostCurrentY != yGridAmount - 1){
        ghostCurrentY++;
    }
    for (var i = 0; i < shape.length; i++) {
        for (var s = 0; s < surfaceX.length; s++) {
            var ghostX = BlockShapePosX[i] + currentX;
            var ghostY = ghostCurrentY + BlockShapePosY[i]- lowestY;
            if(ghostX == surfaceX[s] && surfaceY[s] == ghostY){
                ghostCurrentY--;
                i = -1;
                s = -1;
            }
        }
    }
}


function renderGame() {
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    backgroundImage.render(canvas.width, canvas.height);
    for (var i = 0; i < shape.length; i++) {
        ghostShape[i].render(getGridWidth(), getGridHeight());
        shape[i].render(getGridWidth(), getGridHeight());
    }

    for (var x = 0; x < xGridAmount; x++) {
        for (var y = 0; y < yGridAmount; y++) {
            if (surfaceBlock[x][y] != null) {
                surfaceBlock[x][y].render(getGridWidth(), getGridHeight());
            }
        }
    }

    if(particles.length > 0)
    {
        renderP(canvasContext);
    }
    nextShape.x = canvas.width * 0.65;
    nextShape.y = getGridHeight()/6;
    headerImage.render(canvas.width, getGridHeight() * 2);
    nextShape.render(canvas.width/3, getGridHeight()*1.65);
    canvasContext.fillText("Score: " + score, canvas.width * 0.05, getGridHeight()*0.5);
    canvasContext.fillText("Level: " + level, canvas.width * 0.05, getGridHeight()*1.5);
}

function update() {
    if (time != previousTime) {
        currentY += time - previousTime;
        previousTime = time;
    }
    var counter = 0;
    lowestY = Math.max(...BlockShapePosY);
    for (var i = 0; i < shape.length; i++) {
        BlockGridPosX[i] = BlockShapePosX[i] + currentX;
        BlockGridPosY[i] = BlockShapePosY[i] + currentY;

        shape[i].x = gridCellX[BlockGridPosX[i]];
        shape[i].y = gridCellY[BlockGridPosY[i]];

        var ghostY = ghostCurrentY + BlockShapePosY[i]- lowestY;
        ghostShape[i].x = gridCellX[BlockGridPosX[i]];
        ghostShape[i].y = gridCellY[ghostY];
    }
    if(particles.length > 0)
    {
        for (var i = 0; i < particles.length; i++){
            if(particles.length > 8 && i < particles.length - 8){
                particles[i] = null;
            }
            if(particles[i]!=null){
                particles[i].vy += particleG;
                particleCollision(particles[i]);
            }
        }
    }

    lowestX = Math.min(...BlockShapePosX);
    highestX = Math.max(...BlockShapePosX);

    lowestY = Math.max(...BlockShapePosY);
    highestY = Math.min(...BlockShapePosY);

}

function particleCollision(particle){
    if(particle.y >= canvas.height*0.995){
        if(particle.vy > 0)
            particle.vy *= -0.5;
    }
    if(particle.x <= 0 + canvas.width*0.005 || particle.x >= canvas.width*0.995){
        particle.vx *= -0.95; 
    }
    for (var x = 0; x < xGridAmount; x++) {
        for (var y = yGridAmount; y > 0; y--) {
            if(surfaceBlock[x][y] != null ){
                var a = {x: particle.x, y: particle.y};
                var b = {x: gridCellX[x], y: gridCellY[y]};
                var d = distance(a, b);
                if(d < getGridWidth()*2){
                    if(!(a.x >= b.x + getGridWidth() || a.x <= b.x)){
                        if(!(a.y >= b.y + getGridHeight() || a.y <= b.y)){
                            if(particle.vy > 0 && a.y >= b.y){
                                changeSurfaceColor(x, y, particle.color);
                                particle.vy *= -0.5;
                            }
                            else if(particle.vy < 0 && a.y <= b.y + getGridHeight()){
                                changeSurfaceColor(x, y, particle.color);
                                particle.vy *= -0.5;
                            }
                        }
                    }
                    if(!(a.y > b.y + getGridHeight() || a.y < b.y)){
                        if(!(a.x > b.x + getGridWidth() || a.x < b.x)){
                            if(particle.vx > 0 && a.x >= b.x){
                                changeSurfaceColor(x, y, particle.color);
                                particle.vx *= -0.5;
                            }
                            else if(particle.vx < 0 && a.x <= b.x + getGridWidth()){
                                changeSurfaceColor(x, y, particle.color);
                                particle.vx *= -0.5;
                            }
                        }
                    }
                }
            }
        }
    }
}

function changeSurfaceColor(x, y, pColor){
    switch(pColor){
        case "rgba(255, 0, 0, 0.5)":
            surfaceBlock[x][y] = new image(gridCellX[x], gridCellY[y], "RedBlock.jpg", 0, 0);
            break;
        case "rgba(0, 255, 0, 0.5)":
            surfaceBlock[x][y] = new image(gridCellX[x], gridCellY[y], "GreenBlock.jpg", 0, 0);
            break;
        case "rgba(0, 0, 255, 0.5)":
            surfaceBlock[x][y] = new image(gridCellX[x], gridCellY[y], "BlueBlock.jpg", 0, 0);
            break;
    }
}

function distance(a, b){
    return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
}

function placementCheck() {
    // check that shape has reached ground or the space below is occupied
    var placed = false;
    for (var i = 0; i < shape.length; i++) {
        if (BlockGridPosY[i] == yGridAmount - 1 || gridCellOccupied[BlockGridPosX[i]][BlockGridPosY[i] + 1] == true) {
            placed = true;
            if (BlockGridPosY[i] <= 2) {
                print("Game Over");
                playing = false;
                return;
            }
        }
    }
    if (placed == true) {
        placement();
    }
}

function placement(){
    for (var i = 0; i < shape.length; i++) {
        surfaceBlock[BlockGridPosX[i]][BlockGridPosY[i]] = new image(shape[i].x, shape[i].y, "GreenBlock.jpg", 0, 0);
        gridCellOccupied[BlockGridPosX[i]][BlockGridPosY[i]] = true; 
    }
    if(soundMgr != null){
        soundMgr.playSound(0);
    }
    if(level > 1){
        createParticleArray(canvas.width, 0, canvasContext);
    }

    createNewShape();
}

function emptyShapeElements() {
    shape.length = 0;
    ghostShape.length = 0;
    BlockShapePosX.length = 0;
    BlockShapePosY.length = 0;
    BlockGridPosX.length = 0;
    BlockGridPosY.length = 0;
    if(hardPlacement == true){
        hardPlacement = false;
        timeStep = originalTimeStep;
    }
}

function createNewShape() {
    currentY = 0;
    currentX = spawnPos;
    emptyShapeElements();
    shape = CreateShape();
    nextShape = nextShapeDisplay();
    ghostShape = createGhostShape();
    sortShapePos(shape);
}

function sortShapePos(newShape) {
    for (var i = 0; i < newShape.length; i++) {
        BlockShapePosX.push(newShape[i].x);
        BlockShapePosY.push(newShape[i].y);

        BlockGridPosX.push(BlockShapePosX[i] + currentX);
        BlockGridPosY.push(BlockShapePosY[i] + currentY);

        newShape[i].x = gridCellX[BlockGridPosX[i]];
        newShape[i].y = gridCellY[BlockGridPosY[i]];
    }
}

function checkLine() {
    for (var y = yGridAmount - 1; y > 0; y--) {
        var rowCheck = [];
        for (var x = 0; x < xGridAmount; x++) {
            if (gridCellOccupied[x][y] == true) {
                rowCheck.push(x);
            }
        }
        if (rowCheck.length == xGridAmount) {
            lineDeletion(y);
            lineCounter++;
            LevelSystem();
        }
    }
}

function lineDeletion(yStart) {
    // timeStep = 10;
    for (var yG = yStart; yG > 0; yG--) {
        for (var x = 0; x < xGridAmount; x++) {
            gridCellOccupied[x][yG] = gridCellOccupied[x][yG - 1];
            if (surfaceBlock[x][yG - 1] != null) {
                surfaceBlock[x][yG] = new image(gridCellX[x], gridCellY[yG], "GreenBlock.jpg", 0, 0);
            }
            else {
                surfaceBlock[x][yG] = null;
            }
        }
    }
    // createParticleArray(canvas.width, 0, canvasContext);
}

function LevelSystem(){
    level = Math.floor(lineCounter/ 5) + 1;
    score += 100 * level;
    originalTimeStep = 0.3 - ((level -1) * 0.05); 
}

function getLevelValues(){
    return {Score: score, Level: level};
}

function moveShape(scrollPoint) {
    var left = false;
    var right = false;

    var leftmost = BlockShapePosX[0];
    var rightmost = BlockShapePosX[0];

    var leftmostIndex = 0;
    var rightmostIndex = 0;

    for (var i = 0; i < shape.length; i++) {
        if (BlockShapePosX[i] < leftmost) {
            leftmostIndex = i;
            leftmost = BlockShapePosX[i];
        }
        if (BlockShapePosX[i] > rightmost) {
            rightmostIndex = i;
            rightmost = BlockShapePosX[i];
        }
    }

    if (scrollPoint.x < (gridCellX[BlockGridPosX[leftmostIndex]])) {
        if ((leftmost + currentX) > 0) {
            left = true;
        }
        else {
            left = false;
        }
    }
    else {
        left = false;
    }
    if (scrollPoint.x > (gridCellX[BlockGridPosX[rightmostIndex]] + (canvas.width/ xGridAmount))) {
        if ((rightmost + currentX) < xGridAmount - 1) {
            right = true;
        }
        else {
            right = false;
        }
    }
    else {
        right = false;
    }

    for (var i = 0; i < shape.length; i++) {
        if (BlockGridPosX[i] - 1 > 0) {
            if (gridCellOccupied[BlockGridPosX[i] - 1][BlockGridPosY[i]] == true) {
                left = false;
            }
        }

        if (BlockGridPosX[i] + 1 < xGridAmount - 1) {
            if (gridCellOccupied[BlockGridPosX[i] + 1][BlockGridPosY[i]] == true) {
                right = false;
            }
        }
    }

    if (left == true) {
        currentX--;
        currentChangeX = 0;
    }
    if (right == true) {
        currentX++;
        currentChangeX = 0;
    }
}

function isRotatable(x, y,tempCurrentX){
    var result = true;
    for(var xI = 0; xI < x.length; xI++){
        if(((y[xI] + currentY)) < (yGridAmount -1)){
            if(gridCellOccupied[(x[xI] + tempCurrentX)][(y[xI] + currentY)] == true && (y[xI] + currentY) < yGridAmount - 1){
                print("Cannot rotate: shape");
                result = false;
                break;
            }
        }
        else{
            print("Cannot rotate: ground");
            result = false;
            break;
        }
    }
    return result;
}

function rotateShape(shapeToRotate, clockwise) {

    var oldX = [];
    var oldY = [];

    var checkX = [];
    var checkY = [];

    var tempCurrentX = currentX;
    tempCurrentX -= currentChangeX;
    currentChangeX = 0;

    for (var i = 0; i < shape.length; i++) {
        oldX.push(BlockShapePosX[i]);
        oldY.push(BlockShapePosY[i]);
    }

    var height = (lowestY - highestY) + 1;
    var length = (highestX - lowestX) + 1;

    for (var i = 0; i < shape.length; i++) {
        if(height == 3 || length == 3){
            oldX[i] -= 1;
            oldY[i] -= 1;
        }
        else if(height == 4 || length == 4){
            if(length == 4){
                oldX[i] = i;
                oldY[i] = 2;
            }
            if(height == 4){
                oldX[i] = 2;
                oldY[i] = i;
            }
        }
    }

    for (var i = 0; i < shape.length; i++) {
        checkX.push(oldY[i] * (-1 * clockwise));
        checkY.push(oldX[i] * (1 * clockwise));
    }

    for (var i = 0; i < shape.length; i++) {
        if(height == 3 || length == 3){
            checkX[i] += 1;
            checkY[i] += 1;
        }
        else if(height == 4 || length == 4){
            if(length == 4){
                checkX[i] = oldY[i];
                checkY[i] = oldX[i];
            }
            if(height == 4){
                checkX[i] = oldY[i];
                checkY[i] = oldX[i];
            }
        }
        else if(height == 2 || length == 2){
            checkX[i] = BlockShapePosX[i];
            checkY[i] = BlockShapePosY[i];
        }
    }

    //wall kicks
    if((Math.min(...checkX) + tempCurrentX) < 0){
        while((Math.min(...checkX) + tempCurrentX) < 0){
            tempCurrentX++;
            currentChangeX++;
        }
    }
    if((Math.max(...checkX) + tempCurrentX) > xGridAmount - 1){
        while((Math.max(...checkX) + tempCurrentX) > xGridAmount - 1){
            tempCurrentX--;
            currentChangeX--;
        }
    }

    if(isRotatable(checkX, checkY, tempCurrentX))
    {
        BlockShapePosX.length = 0;
        BlockShapePosY.length = 0;

        BlockShapePosX = checkX;
        BlockShapePosY = checkY;

        currentX = tempCurrentX;
    }
}