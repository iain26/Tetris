var menu = true;
var background;
var logo;
var playButton;

function startMenu(){
    initialiseMenu();
    menuLoop();
}

function initialiseMenu(){
    menu = true;
    background = new image(0, 0, "Menu.png", 0, 0);
    logo = new image(canvas.width/ 2 - (getGridWidth() * 4.5), canvas.height*0.10, "TetryLOGO.png", 0, 0);
    playButton = new image(canvas.width/ 2 - (getGridWidth() * 1.5), canvas.height*0.62, "PlayButton.png", 0, 0);
}

function menuLoop(){
    renderMenu();
    if(menu == true){
        requestAnimationFrame(menuLoop);
    }
}

function renderMenu(){
    background.render(canvas.width, canvas.height);
    logo.render(getGridWidth() * 9, getGridHeight() * 3);
    playButton.render(getGridWidth() * 3, getGridHeight() * 2);
}

function playButtonCheck(press){
    if(press.x > playButton.x && press.x < playButton.x + getGridWidth() * 3){
        if(press.y > playButton.y && press.y < playButton.y + getGridHeight() * 2){
            playGame();
        }
    }
}