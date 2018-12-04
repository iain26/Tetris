var replay = true;
var replayBackground;
var replayButton;

function startReplay(){
    initialiseReplay();
}

function initialiseReplay(){
    replay = true;
    replayBackground = new image(0, 0, "Menu.jpg", 0, 0);
    replayButton = new image(canvas.width*0.25, canvas.height*0.55, "ReplayButton.jpg", 0, 0);
    replayLoop();
    styleText('red', '25px Courier New', 'left', 'middle');
    if(soundMgr != null){
        soundMgr.playMusic(1);
    }
}

function replayLoop(){
    renderReplay();
    if(replay == true){
        requestAnimationFrame(replayLoop);
    }
}

function renderReplay(){
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    replayBackground.render(canvas.width, canvas.height);
    replayButton.render(canvas.width*0.5, canvas.height*0.125);
    canvasContext.fillText("You reached level " + getLevelValues().Level, canvas.width * 0.005, canvas.height * 0.1);
    canvasContext.fillText("with a score of " + getLevelValues().Score + "!!!", canvas.width * 0.005, canvas.height * 0.2);
}

function replayButtonCheck(press){
    if(press.x > playButton.x && press.x < playButton.x + canvas.width*0.5){
        if(press.y > playButton.y && press.y < playButton.y + canvas.height*0.125){
            if(soundMgr != null){
                soundMgr.playSound(1);
                soundMgr.playMusic(0);
            }
            playGame();
            replay = false;
        }
    }
}