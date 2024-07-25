const canvas = document.getElementById('GameScreen');
const context = canvas.getContext('2d');
const ballRadius = 2;
const paddleHeight = canvas.height / 5;
const paddleWidth = canvas.width / 40;
const getRandom = (min, max) => Math.random() * (max - min) + min;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballXVector = getRandom(-2, 2);
let ballYVector = getRandom(-2, 2);
let paddleLeftX = 0;
let paddleLeftY = (canvas.height - paddleHeight) / 2;
let paddleLeftUp = false;
let paddleLeftDown = false;
let paddleRightX = canvas.width - paddleWidth;
let paddleRightY = paddleLeftY;
let paddleRightUp = false;
let paddleRightDown = false;
let loop;

function drawBall() {
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight);
    context.fillStyle = "red";
    context.fill();
    context.closePath();

    context.beginPath();
    context.rect(paddleRightX, paddleRightY, paddleWidth, paddleHeight);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

function isPointInCircle(rx, ry) {
    let deltaX = ballX - rx;
    let deltaY = ballY - ry;
    let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (length > ballRadius)
        return false;
    return true;
}

function isCollision(rx, ry) {
    if ((rx <= ballX && ballX <= rx + paddleWidth) || (ry <= ballY && ballY <= ry + paddleHeight)) {
        if ((rx <= ballX && ballX <= rx + paddleWidth)
        && (ry - ballRadius <= ballY && ballY <= ry + ballRadius + paddleHeight)) {
            ballYVector *= -1;
        }
        if ((rx - ballRadius < ballX && ballX < rx + ballRadius + paddleWidth)
        && (ry <= ballY && ballY <= ry + paddleHeight)) {
            ballXVector *= -1;
        }
    } else if (isPointInCircle(rx, ry)
    || isPointInCircle(rx + paddleWidth, ry)
    || isPointInCircle(rx, ry + paddleHeight)
    || isPointInCircle(rx + paddleWidth, ry + paddleHeight)) {
        ballXVector *= -1;
        ballYVector *= -1;
    }
}

function keyDownHandler(e) {
    if (e.keyCode == 38) {
        paddleRightUp = true;
    } else if (e.keyCode == 40) {
        paddleRightDown = true;
    } else if (e.keyCode == 87) {
        paddleLeftUp = true;
    } else if (e.keyCode == 83) {
        paddleLeftDown = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 38) {
        paddleRightUp = false;
    } else if (e.keyCode == 40) {
        paddleRightDown = false;
    } else if (e.keyCode == 87) {
        paddleLeftUp = false;
    } else if (e.keyCode == 83) {
        paddleLeftDown = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    isCollision(paddleLeftX, paddleLeftY);
    isCollision(paddleRightX, paddleRightY);
    if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballYVector *= -1;
    }
    if (ballX - ballRadius <= 0 || ballX + ballRadius >= canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballXVector = getRandom(-2, 2);
        ballYVector = getRandom(-2, 2);
    }
    
    if (paddleLeftUp && !paddleLeftDown && paddleLeftY > 0) {
        paddleLeftY -= paddleHeight / 10;
    } else if (paddleLeftDown && !paddleLeftUp && paddleLeftY + paddleHeight < canvas.height) {
        paddleLeftY += paddleHeight / 10;
    }

    if (paddleRightUp && !paddleRightDown && paddleRightY > 0) {
        paddleRightY -= paddleHeight / 10;
    } else if (paddleRightDown && !paddleRightUp && paddleRightY + paddleHeight < canvas.height) {
        paddleRightY += paddleHeight / 10;
    }

    ballXVector *= 1.001;
    ballYVector *= 1.001;
    ballX += ballXVector;
    ballY += ballYVector;
}

loop = setInterval(draw, 10);