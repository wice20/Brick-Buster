// board stuff
let board = [];
let boardWidth = 50;
let boardHeight = 50;
let context;

//player 
let playerWidth = 110;
let playerHeight = 10;
let playerVelocityX = 10;//this is for side to side
    
let player={
    x : boardWidth + 40 + playerWidth,
    y : boardHeight - playerHeight + 430,
    width : playerWidth,
    height : playerHeight,
    velocityX : playerVelocityX
}

//ball time
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX =4;//this is for side to side
let ballVelocityY= 3;//this is for up and down
let ball ={
    x : player.x + player.width/2,
    y : player.y - ballHeight,
    width : ballWidth,
    height : ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//blocks

let blockArray = [];
let blockWidth = 50;
let blockHeight = 20;
let blockRows = 3;// we need to make it so that the number of rows increases as the player clears all the blocks and moves on from the level
let blockColumns = 8;
let blockMaxRows = 10;
let blockCounter = 0;
 
// blocks starting from the left

let blockX = 15;
let blockY = 50;

// This is to track the score and the lives left for the player
let score = 0;
let lives= 3;

if(lives==0){
    //game over
    alert("Game Over");
}

if(score==blockRows*blockColumns){
    //level complete
    alert("Level Complete");
}

//This is to create the board and to get it ready 

window.onload = function () {
    board = document.getElementById("board");   
    board.width=boardWidth * 10;
    board.height=boardHeight * 10;
    context = board.getContext("2d");

    //make player
    context.fillStyle = "rgb(129, 6, 6)";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer)

    //for creating the blocks
    createBlocks();
}
function update() {
    requestAnimationFrame(update);
    context.clearRect(0,0, board.width, board.height)
    
    context.fillStyle="rgb(129,6,6)";
    context.fillRect(player.x, player.y, player.width, player.height);
  
    context.fillStyle="rgb(255, 255, 255)";
    ball.x+=ball.velocityX;
    ball.y+=ball.velocityY;
    context.fillRect(ball.x,ball.y,ball.width,ball.height);

    //ball bouncing
    if(ball.y<=0){
        ball.velocityY*=-1;//ball hitting top
    }
    else if(ball.x<=0 ||( ball.x + ball.width)>= board.width){
        ball.velocityX*=-1;// ball hitting the sides
    }
    else if(ball.y + ball.height >=board.height ){ 
    //game ending when ball touches bottom
        lives-=1;
        document.getElementById("lives").textContent=lives;
        if(lives==0){
            alert("Game Over");
        }
        //to reset the ball
        ball.x = player.x + player.width/2;
        ball.y = player.y - ballHeight;
        ball.velocityX = ballVelocityX;
        ball.velocityY = -Math.abs(ballVelocityY);
    }
    

    if(topCollision(ball,player)|| bottomCollision(ball,player)){// to make ball bounce off paddle
        ball.velocityY*=-1;
    }
    else if(leftCollision( ball,player ) || rightCollision( ball, player)){
        ball.velocityX*=-1;
    }
    
//block making time
    context.fillStyle = "rgb(9, 242, 98)";
    for(let i = 0; i < blockArray.length; i++){
        let block = blockArray [i];
        if(!block.break){
            if (topCollision(ball, block)|| bottomCollision(ball, block)){
                block.break = true;
                ball.velocityY*=-1; //for ball bouncing off the block
                blockCounter-=1;
                score+=1;
                document.getElementById("score").textContent=score;
            }
            else if(leftCollision(ball, block)|| rightCollision(ball, block)){
                block.break = true;
                ball.velocityX*=-1; // to change direction of the ball when it hits the block from the left or right
                blockCounter-=1;
            }
            context.fillRect( block.x, block.y, block.width, block.height );
        }
    }
}

function out(xPosition){
    return (xPosition < 0 || xPosition + playerWidth > board.width);
}


function movePlayer(e) {
    if (e.code == "ArrowLeft") {
        //player.x -= player.velocityX;
        let nextPlayerX=player.x - player.velocityX;
        if(!out(nextPlayerX)){
            player.x=nextPlayerX;
        }
    } else if (e.code == "ArrowRight") {
    let nextPlayerX = player.x + player.velocityX;
    if(!out(nextPlayerX)){
        player.x = nextPlayerX;
    }
}
}

function detectCollision(a,b){
    return a.x < b.x + b.width && 
    a.x + a.width > b.x && 
    a.y < b.y + b.height && 
    a.y + a.height > b.y;
}

function topCollision(ball, brick){        //so a is ball and b is brick
    return detectCollision(ball,brick) && (ball.y + ball.height)>=brick.y;
    
}

function bottomCollision(ball, brick){
    return detectCollision(ball,brick) && ball.y <= (brick.y + brick.height);
    if(bottomCollision(ball, brick)){
        return life=lives-1;
    }
        
}

function leftCollision(ball, brick) {
    return detectCollision(ball, brick) && (ball.x + ball.width) >= brick.x;
}

function rightCollision(ball, brick) {
    return detectCollision(ball, brick) && ball.x <= (brick.x + brick.width);
}

function createBlocks() {
    blockArray = []; // this is to reset the blocks so that when the player goes to the next level there are new blocks to break
    for(let c = 0; c < blockColumns; c++){
        for(let r = 0; r < blockRows; r++){
            let block  = {
                x : blockX + c* blockWidth + c*10, // the c*10 is to add a space between the blocks for columns
                y : blockY + r*blockHeight + r*10, // the r*10 is to add a space of 10 between the blocks for rows
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCounter = blockArray.length;

}
