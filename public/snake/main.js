var c = document.getElementById("snakeCanvas");
var ctx = c.getContext("2d");
const WIDTH = 600;
const HEIGHT = 600;
const BODYHIGHT = 15;
const BODYWIDTH = 15;
let clients;
let food;

var socket = io("http://localhost:3000");
socket.on("connect", function () {
  console.log("Connected to Server!");
});
socket.on("event", function (data) {});
socket.on("disconnect", function () {
  socket.close();
});

ctx.fillStyle = "black";
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.stroke();

socket.on("move", clientsS => {
  clients = clientsS;
});

setInterval(function () {
  if (clients !== undefined) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.stroke();

    for (let c of clients) {
      drawBody(c.snake.body);
    }

    drawScore(clients);
  }
  if (food.x !== null) drawFood();
}, 10);

function drawBody(body, color) {
  for (let [i, bp] of body.entries()) {
    let {
      x,
      y
    } = bp;

    //ctx.strokeStyle = "red";
    ctx.fillStyle = color;
    ctx.fillRect(x, y, BODYWIDTH, BODYHIGHT);
    //ctx.stroke();
    if (i === 0) {
      ctx.fillStyle = "green";
      ctx.fillRect(x, y, BODYWIDTH, BODYHIGHT);
    }
  }
}

function drawScore(clients) {
  let score = clients.find(x => x.id === socket.id).snake.score;
  ctx.strokeStyle = "white";
  ctx.font = "30px Verdana";
  ctx.strokeText(score, WIDTH - 50, 50);
}

socket.on("food", foodS => {
  food = foodS;
});


function drawFood() {
  ctx.strokeStyle = "red";
  ctx.strokeRect(food.x, food.y, BODYHIGHT, BODYWIDTH);
}

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37: // left
      socket.emit("changeDirection", "left");
      break;
    case 38: // up
      socket.emit("changeDirection", "up");
      break;
    case 39: // right
      socket.emit("changeDirection", "right");
      break;
    case 40: // down
      socket.emit("changeDirection", "down");
      break;
  }
};

const nameButton = document.getElementById("nameButton");
nameButton.addEventListener("click", () => {
  const nickname = document.getElementById("nameInput").value;
  socket.emit("nameChange", nickname);
});