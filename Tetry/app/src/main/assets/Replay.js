var replay = true;
var replayBackground;
var replayButton;

function startReplay(){
    initialiseReplay();
    replayLoop();
}

function initialiseReplay(){
    replay = true;
    replayBackground = new image(0, 0, "Menu.png", 0, 0);
    replayButton = new image(canvas.width/ 2 - (getGridWidth() * 1.5), canvas.height*0.62, "ReplayButton.png", 0, 0);
}

function replayLoop(){
    // renderReplay();
    if(replay == true){
        requestAnimationFrame(replayLoop);
    }
}

function renderReplay(){
    background.render(canvas.width, canvas.height);
    replayBackground.render(getGridWidth() * 3, getGridHeight() * 2);
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    canvasContext.strokeRect(1,1, canvas.width - 2, canvas.height -2);
}

function replayButtonCheck(press){
    if(press.x > playButton.x && press.x < playButton.x + getGridWidth() * 3){
        if(press.y > playButton.y && press.y < playButton.y + getGridHeight() * 2){
            playGame();
        }
    }
}