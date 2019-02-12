

function RunAgent(){
    //touch up
    // what direction to rotate - decided by what side of screen pressed
    var clockwise;
    if(currentTouchPoint.x > canvas.width/3){
        clockwise = 1;
    }
    else{
        clockwise = -1;
    }

    // tapping the screen rotates the current shape
    if (elapsed < 0.15) {
        rotateShape(clockwise);
    }

    // touch down
    // holding down longing means that game expects movement input
    var elapsed = Date.now() / 1000 - timePressed;
    if (elapsed >= 0.15) {
        moveShape(currentTouchPoint);
    }
}
