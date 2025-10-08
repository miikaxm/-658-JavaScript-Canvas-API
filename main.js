const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

// Event listenerit näppäimille
document.addEventListener("keydown", handlekeyPress)
document.addEventListener("mousedown", handleMouse)

// Kuvat
var backgroundImg = new Image;
backgroundImg.src = "img/background.png"

var pipeImg = new Image;
pipeImg.src = "img/pipe-green.png"

var upPipeImg = new Image;
upPipeImg.src = "img/pipe-green-up.png"

// Pelaajan tiedot
let player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    color: "red"
}

// Esteet
let obstacles = []

// Perustiedot
let dy = 0
let score = 0
canvas.width = 480
canvas.height = 640

// Hyppy tiedot
let gravity = 0.6
let velocityY = 0
let jumpPower = -10


backgroundImg.onload = function() {
    gameloop = setInterval(updateGame, 20)
}
setInterval(spawnObstacle, 2000)


function handlekeyPress(e) {
    const key = e.key

    // Välilyönti hyppyyn
    if (key === " ") {
        velocityY = jumpPower
    }
}

function handleMouse(e) {
    if (e.button === 0) {
        velocityY = jumpPower
    }
}

function updateGame() {
    // Esteiden liikkeet
    obstacles.forEach(obstacle => {
        obstacle.x -= 3
    });

    // Pelaajan liikeet
    player.y += velocityY

    velocityY += gravity

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height
        gameOver()
        return
    }

    obstacles = obstacles.filter(obs => obs.x + obs.width > 0)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground()
    drawPlayer()
    drawObstacle()
    checkCollision()
}

// Piirtää pelaajan
function drawPlayer() {
    ctx.fillStyle = player.color
    ctx.fillRect(player.x, player.y, 50, 50)
}

// Piirtää esteet
function drawObstacle() {
    for (let obs of obstacles) {
        if (obs.downPipe) {
            ctx.drawImage(pipeImg, obs.x, obs.y, obs.width, obs.height);
        } else {
            ctx.drawImage(upPipeImg, obs.x, obs.y, obs.width, obs.height);
        }
        
    }
}

// Piirtää taustakuvan
function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
}

function checkCollision() {
    for (let obs of obstacles) {
        let hitX = player.x + player.width > obs.x && player.x < obs.x + obs.width;
        let hitY = player.y + player.height > obs.y && player.y < obs.y + obs.height;
        if (hitX && hitY) {
            gameOver();
            return;
        }
    }
}

// Game over screen
function gameOver(){
    clearInterval(gameloop)
    ctx.clearRect(0,0 ,canvas.width, canvas.height)
    ctx.fillStyle = "black"
    ctx.font = "30px Arial"
    ctx.fillText("Game Over", 200, 130)
    ctx.fillText(`Score: ${score}`, 200, 170)
}

// Tekee uuden esteen joka 2 sekuntti
function spawnObstacle() {
    let gap = 170 // aukon korkeus
    let minTopHeight = 50
    let maxTopHeight = canvas.height - gap - 50
    let topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight)) + minTopHeight

    let bottomY = topHeight + gap
    let bottomHeight = canvas.height - bottomY

    // Yläpalkki
    obstacles.push({
        x: canvas.width,
        y: 0,
        width: 40,
        height: topHeight,
        downPipe: false
    })

    // Alapalkki
    obstacles.push({
        x: canvas.width,
        y: bottomY,
        width: 40,
        height: bottomHeight,
        downPipe: true
    })
}