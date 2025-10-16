const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false;
gameStarted = false

// Event listenerit näppäimille
document.addEventListener("keydown", handlekeyPress)
document.addEventListener("mousedown", handleMouse)

// Kuvat
// Pelin taustakuva
var backgroundImg = new Image;
backgroundImg.src = "img/Flappy Bird Assets/Background/Background7.png"

// Esteet
var newPipe = new Image;
newPipe.src = "img/Flappy Bird Assets/Tiles/Style 1/PipeStyle1.png"

// Pelaajan kuva
var playerSpriteSheet = new Image;
playerSpriteSheet.src = "img/Flappy Bird Assets/Player/StyleBird1/Bird1-3.png"
playerSpriteSheet.width = 16

// Numerot
const spriteNumbers = new Image();
spriteNumbers.src = "img/spritesheet.png";

// Game over näyttö
const gameOverScreenSprites = new Image();
gameOverScreenSprites.src = "img/spritesheet.png"

// kolikot
const coinsSprite = new Image();
coinsSprite.src = "img/spritesheet.png"

// Restart nappi
const restartBtn = new Image();
restartBtn.src = "img/Buttons Pixel Animation Pack/restart/72px/restart01.png"

const coins = {
    0: { x: 302, y: 137, w: 22, h: 22},
    1: { x: 266, y: 229, w: 22, h: 22},
    2: { x: 242, y: 229, w: 22, h: 22},
}

const numbers = {
  0: { x: 288, y: 100, w: 7, h: 10 },
  1: { x: 291, y: 118, w: 5, h: 10 },
  2: { x: 289, y: 134, w: 7, h: 10 },
  3: { x: 289, y: 150, w: 7, h: 10 },
  4: { x: 287, y: 173, w: 7, h: 10 },
  5: { x: 287, y: 185, w: 7, h: 10 },
  6: { x: 165, y: 245, w: 7, h: 10 },
  7: { x: 175, y: 245, w: 7, h: 10 },
  8: { x: 185, y: 245, w: 7, h: 10 },
  9: { x: 195, y: 245, w: 7, h: 10 },
};

gameOverSprites = {
    0: { x: 146, y: 199, w: 94, h: 19 },
    1: { x: 146, y: 58, w: 113, h: 58 },
}

// Pelaajan tiedot
let player = {
    x: 100,
    y: 300,
    width: 50,
    height: 50,
    frame: 0,
    frameCount: 4,
    frameWidth: 16,
    frameHeight: 16,
    frameSpeed: 8,
}

var frameTimer = 0;

// Esteet
let obstacles = []

// Perustiedot
let dy = 0
let score = 0
canvas.width = 480
canvas.height = 640

// Hyppy tiedot
let gravity = 0.7
let velocityY = 0
let jumpPower = -10

// Aloittaa pelin sitten kun taustakuva on latautunut
backgroundImg.onload = function() {
    gameloop = setInterval(updateGame, 20)
}
setInterval(spawnObstacle, 2000)

// Välilyönti hyppy
function handlekeyPress(e) {
    const key = e.key
    if (key === " " && gameStarted === false) {
        gameStarted = true
        velocityY = jumpPower
    }
    if (key === " ") {
        velocityY = jumpPower
    }
}

// Hiiri hyppy
function handleMouse(e) {
    if (e.button === 0 && gameStarted === false) {
        gameStarted = true
        velocityY = jumpPower
    }
    if (e.button === 0) {
        velocityY = jumpPower
    } 
}

function updateGame() {
    // Esteiden liikkeet
    if (gameStarted) {
            obstacles.forEach(obstacle => {
            obstacle.x -= 3
        });

        // Pelaajan liikeet
        player.y += velocityY
        velocityY += gravity
    }
    

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height
        gameOver()
        return
    }

    // Esteet pois kun ei enää näy näytössä
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground()
    drawPlayer()
    drawObstacle()
    drawScore(ctx, score, 220, 50, 4)
    checkCollision()
    update()
}

// Piirtää pelaajan
function drawPlayer() {
    var sx = player.frame * player.frameWidth;
    var sy = 0;

    ctx.imageSmoothingEnabled = false;   // pakota pois päältä
    ctx.imageSmoothingQuality = "low";   // ei interpolointia

    ctx.drawImage(
        playerSpriteSheet,
        sx, sy, player.frameWidth, player.frameHeight,
        Math.floor(player.x), Math.floor(player.y), 
        Math.floor(player.width), Math.floor(player.height)
    );
}

// Piirtää esteet
function drawObstacle() {
    const spriteWidth = 32;
    const spriteHeight = 80;
    const col = 0
    const row = 0
    const sx = col * spriteWidth
    const sy = row * spriteHeight
    for (let obs of obstacles) {
        if (obs.downPipe) {
            ctx.drawImage(
                newPipe,
                sx, sy,
                spriteWidth, spriteHeight,
                obs.x, obs.y,
                obs.width, obs.height
            );
        } else {
            ctx.drawImage(
                newPipe,
                sx, sy,
                spriteWidth, spriteHeight,
                obs.x, obs.y,
                obs.width, obs.height
            );
        }
    }
}

// Piirtää taustakuvan
function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
}

function checkCollision() {
    if (player.y < 0) {
        player.y = 0;
        velocityY = 0;
    }

    for (let obs of obstacles) {
        let hitX = player.x + player.width > obs.x && player.x < obs.x + obs.width;
        let hitY = player.y + player.height > obs.y && player.y < obs.y + obs.height;
        if (!obs.scored && player.x > obs.x + (obs.width/4) && obs.downPipe) {
            score += 1;
            obs.scored = true;
        }
        if (hitX && hitY) {
            gameOver();
            return;
        }
    }
}

// Tekee uuden esteen joka 2 sekuntti
function spawnObstacle() {
    let gap = 170 // aukon korkeus
    let minTopHeight = 75
    let maxTopHeight = canvas.height - gap - 50
    let topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight)) + minTopHeight

    let bottomY = topHeight + gap
    let bottomHeight = canvas.height - bottomY

    // Yläpalkki
    obstacles.push({
        x: canvas.width,
        y: 0,
        width: 80,
        height: topHeight,
        downPipe: false
    })

    // Alapalkki
    obstacles.push({
        x: canvas.width,
        y: bottomY,
        width: 80,
        height: bottomHeight,
        downPipe: true
    })
}

function update() {
    frameTimer++;
    if (frameTimer >= player.frameSpeed) {
        frameTimer = 0;
        player.frame = (player.frame + 1) % player.frameCount;
    }
}

function drawScore(ctx, score, x, y, scale) {
  const digits = String(score).split("");
  const scalef = scale
  digits.forEach((digit, i) => {
    // Siirretään jokaista numeroa hieman oikealle
    drawNumber(ctx, digit, x + i * 17, y, scalef);
  });
}


function drawNumber(ctx, num, x, y, scale) {
    const n = numbers[num];
    const sscale = scale; // Skaalauskerroin
    ctx.drawImage(spriteNumbers, n.x, n.y, n.w, n.h, x, y, n.w * sscale, n.h * sscale);
}

// Game over screen
function gameOver(){
    saveHighScore(score);
    clearInterval(gameloop)
    const gameOverText = gameOverSprites[0];
    const scoreBoard = gameOverSprites[1];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Kolikot
    const bronzeCoin = coins[0]
    const silverCoin = coins[1]
    const GoldCoin = coins[2]

    // Game over teksti
    const goScale = 2.5;
    const goW = gameOverText.w * goScale;
    const goH = gameOverText.h * goScale;
    ctx.drawImage(
        gameOverScreenSprites,
        gameOverText.x, gameOverText.y, gameOverText.w, gameOverText.h,
        centerX - goW / 2, centerY - goH - 40,
        goW, goH
    );

    // Pistetaulukko
    const sbScale = 2.2;
    const sbW = scoreBoard.w * sbScale;
    const sbH = scoreBoard.h * sbScale;
    ctx.drawImage(
        gameOverScreenSprites,
        scoreBoard.x, scoreBoard.y, scoreBoard.w, scoreBoard.h,
        centerX - sbW / 2, centerY - sbH / 2 + 60,
        sbW, sbH
    );

    const scoreX = centerX - -70;
    const scoreY = centerY + 30;
    drawScore(ctx, score, scoreX, scoreY+5, 2);
    drawScore(ctx, getHighScore(), scoreX+3, scoreY+50, 2)

    // Kolikot scoreboardiin scoren mukaan
    if (score >= 10 && score < 25) {
        ctx.drawImage(
            coinsSprite,
            bronzeCoin.x, bronzeCoin.y, bronzeCoin.w, bronzeCoin.h,
            144, 363, 22*sbScale, 22*sbScale
        )
    } else if (score >= 25  && score < 50) {
        ctx.drawImage(
            coinsSprite,
            silverCoin.x, silverCoin.y, silverCoin.w, silverCoin.h,
            144, 363, 22*sbScale, 22*sbScale
        )
    } else if (score >= 50) {
        ctx.drawImage(
            coinsSprite,
            GoldCoin.x, GoldCoin.y, GoldCoin.w, GoldCoin.h,
            144, 363, 22*sbScale, 22*sbScale
        )
    }

    // Restart nappi
    const restartBtnScale = 1;
    const restartBtnW = restartBtn.width * restartBtnScale;
    const restartBtnH = restartBtn.height * restartBtnScale;
    ctx.drawImage(
        restartBtn,
        0, 0, restartBtn.width, restartBtn.height,
        centerX - restartBtnW / 2, centerY + sbH / 2 + 80,
        restartBtnW, restartBtnH
    );

    // Käynnistää pelin uudestaan jos restart nappia painetaan
    canvas.onclick = function(e) {
        const btnX = centerX - restartBtnW / 2;
        const btnY = centerY + sbH / 2 + 80;
        if (
            e.offsetX >= btnX &&
            e.offsetX <= btnX + restartBtnW &&
            e.offsetY >= btnY &&
            e.offsetY <= btnY + restartBtnH
        ) {
            // Nollaa kaikki peliin liittyvät tiedot
            score = 0;
            player.x = 100;
            player.y = 300;
            velocityY = 0;
            obstacles = [];
            gameStarted = false;
            frameTimer = 0;
            player.frame = 0;
            gameloop = setInterval(updateGame, 20);
            canvas.onclick = null;
        }
    };
}

// Local storage
function saveHighScore(score) {
    const highScore = localStorage.getItem("highScore") || 0;
    if (score > highScore) {
        localStorage.setItem("highScore", score);
    }
}

function getHighScore() {
    return localStorage.getItem("highScore") || 0;
}