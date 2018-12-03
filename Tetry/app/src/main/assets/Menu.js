var menu = true;
var background;
var logo;
var playButton;

function startMenu(){
    initialiseMenu();
}

function initialiseMenu(){
    menu = true;
    background = new image(0, 0, "Menu.jpg", 0, 0);
    logo = new image(canvas.width/ 2 - (getGridWidth() * 4.5), canvas.height*0.10, "TetryLOGO.png", 0, 0);
    playButton = new image(canvas.width/ 2 - (getGridWidth() * 1.5), canvas.height*0.62, "PlayButton.jpg", 0, 0);
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
    playButton.render(getGridWidth() * 3, getGridHeight() * 2);
    logo.render(getGridWidth() * 9, getGridHeight() * 3);
    print("Run");
}

function playButtonCheck(press){
    if(press.x > playButton.x && press.x < playButton.x + getGridWidth() * 3){
        if(press.y > playButton.y && press.y < playButton.y + getGridHeight() * 2){
            playGame();
            menu = false;
        }
    }
}