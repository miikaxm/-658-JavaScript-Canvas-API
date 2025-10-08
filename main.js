const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
document.addEventListener("keydown", handlekeyPress)

var img = new Image;
img.src = "img/background.png"


let player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    color: "red"
}

let obstacles = []

let dx = 0
let dy = 0
let score = 0
canvas.width = 480
canvas.height = 640

// Hyppy tiedot
let gravity = 0.6
let velocityY = 0
let jumpPower = -10


img.onload = function() {
    // peli voi alkaa, kun tausta on ladattu
    gameloop = setInterval(updateGame, 20)
}
setInterval(spawnObstacle, 2000)


function handlekeyPress(e) {
    const key = e.key
    if (key === "ArrowLeft") {
        dx = -3
    } else if (key === "ArrowRight") {
        dx = 3
    }

    // Välilyönti hyppyyn
    if (key === " ") {
        velocityY = jumpPower
    }
}

function updateGame() {
    // Obstaakkelin liikkeet
    obstacles.forEach(obstacle => {
        obstacle.x -= 3
    });

    // Pelaajan liikeet
    player.x += dx
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
    
}

// Piirtää pelaajan
function drawPlayer() {
    ctx.fillStyle = player.color
    ctx.fillRect(player.x, player.y, 50, 50)
}

function drawObstacle() {
    for (let obs of obstacles) {
        ctx.fillStyle = obs.color
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
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

function spawnObstacle() {
    let gap = 170 // aukon korkeus
    let minTopHeight = 50
    let maxTopHeight = canvas.height - gap - 50
    let topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight)) + minTopHeight

    let bottomY = topHeight + gap
    let bottomHeight = canvas.height - bottomY

    let color = "green"

    // Yläpalkki
    obstacles.push({
        x: canvas.width,
        y: 0,
        width: 40,
        height: topHeight,
        color: color
    })

    // Alapalkki
    obstacles.push({
        x: canvas.width,
        y: bottomY,
        width: 40,
        height: bottomHeight,
        color: color
    })
}

function drawBackground() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}