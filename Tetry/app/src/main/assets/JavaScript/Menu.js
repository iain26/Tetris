var menu = true;
var background;
var logo;
var playButton;

function startMenu(){
    initialiseMenu();
}

function initialiseMenu(){
    menu = true;
    background = new image(0, 0, "MenuBorder.jpg", 0, 0);
    logo = new image(canvas.width*0.07, canvas.height*0.04, "TetryLOGO.png", 0, 0);
    playButton = new image(canvas.width*0.25, canvas.height*0.55, "PlayButton.jpg", 0, 0);
    menuLoop();
}

function menuLoop(){
    renderMenu();
    if(menu == true){
        requestAnimationFrame(menuLoop);
    }
}

function renderMenu(){
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    background.render(canvas.width, canvas.height);
    logo.render(canvas.width*0.85, canvas.height*0.15);
    playButton.render(canvas.width*0.5, canvas.height*0.125);
}

function playButtonCheck(press){
    if(press.x > playButton.x && press.x < playButton.x + canvas.width*0.5){
        if(press.y > playButton.y && press.y < playButton.y + canvas.height*0.125){
            if(soundMgr != null){
                soundMgr.playSound(1);
            }
            playGame();
            menu = false;
        }
    }
}