var instruction = true;
var instructBackground;
var skipButton;

function startInstruction(){
    initialiseInstruct();
}

function initialiseInstruct(){
    instruction = true;
    instructBackground = new image(0, 0, "grey-background.jpg", 0, 0);
    skipButton = new image(canvas.width*0.25, canvas.height*0.007, "SkipButton.jpg", 0, 0);
    instuctionLoop();
}

function instuctionLoop(){
    renderInstruct();
    if(instruction == true){
        requestAnimationFrame(instuctionLoop);
    }
}

function renderInstruct(){
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    instructBackground.render(canvas.width, canvas.height);
    skipButton.render(canvas.width*0.4, canvas.height*0.1);
}

function skipButtonCheck(press){
    if(press.x > skipButton.x && press.x < skipButton.x + canvas.width*0.4){
        if(press.y > skipButton.y && press.y < skipButton.y + canvas.height*0.1){
            if(soundMgr != null){
                soundMgr.playSound(1);
            }
            skipInstructions();
            instruction = false;
        }
    }
}