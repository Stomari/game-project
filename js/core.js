const themeSong = new Audio('sounds/seal-kiss-from-a-rose.mp3');
let highScore = 0;

const gameArea = {
  canvas: document.createElement('canvas'),
  frames: 0,
  points: 0,
  menu() {
    this.canvas.width = 1000;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d');
    const game = document.getElementById('game');
    game.insertBefore(this.canvas, game.childNodes[0]);
    window.onload = () => {
      const menuImg = document.getElementById('menu');
      this.ctx.drawImage(menuImg, 0, 0, gameArea.canvas.width, gameArea.canvas.height);
      const menuLogo = document.getElementById('logo');
      this.ctx.drawImage(menuLogo, 150, 300, 700, 200);
      this.ctx.font = '30px Architects Daughter';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText('PRESS ENTER TO START', 320, 500);
    };
  },
  start() {
    this.interval = setInterval(updateGameArea, gameArea.canvas.width / 60);
  },
  drawBoard() {
    this.ctx.beginPath();
    const grd = this.ctx.createLinearGradient(0, gameArea.canvas.height, 0, 500);
    grd.addColorStop(0, '#20C3D0');
    grd.addColorStop(1, 'white');
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 500, gameArea.canvas.width, 100);
    this.ctx.closePath();
  },
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop() {
    clearInterval(this.interval);
  },
  score() {
    if (Math.floor(this.frames % 60) === 0) {
      this.points += 1;
    }
    this.ctx.font = '30px Architects Daughter';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`Score: ${this.points}`, 440, 50);
  },
  scoreBonus() {
    this.points += 10;
    this.ctx.font = '30px Architects Daughter';
    this.ctx.fillStyle = 'black';
    const bonusInterval = setInterval(() => this.ctx.fillText('+10', 535, 80), gameArea.canvas.width / 60);
    setTimeout(() => clearInterval(bonusInterval), 2000);
  },
};

const backgroundImage = {
  background: document.getElementById('background'),
  x: 0,
  speed: -1,
  move() {
    this.x += this.speed;
    this.x %= gameArea.canvas.width;
  },
  draw() {
    gameArea.ctx.drawImage(this.background, this.x, 0, gameArea.canvas.width, gameArea.canvas.height);
    if (this.speed < 0) {
      gameArea.ctx.drawImage(this.background, this.x + gameArea.canvas.width, 0, gameArea.canvas.width, gameArea.canvas.height);
    } else {
      gameArea.ctx.drawImage(this.background, this.x - this.background.width, 0, gameArea.canvas.width, gameArea.canvas.height);
    }
  },
};

function checkGameOver() {
  const crashed = myObstacles.some(obstacle => seal.crashWith(obstacle));
  const crashed2 = myObstacles2.some(obstacle => seal.crashWith(obstacle));

  if (crashed || crashed2) {
    gameArea.stop();
    if (highScore < gameArea.points) {
      highScore = gameArea.points;
    }
    setTimeout(() => {
      const gameOverImg = document.getElementById('game-over');
      gameArea.ctx.drawImage(gameOverImg, 0, 0, gameArea.canvas.width, gameArea.canvas.height);
      gameArea.ctx.font = '100px Architects Daughter';
      gameArea.ctx.fillStyle = 'black';
      gameArea.ctx.fillText('GAME OVER', 200, 200);
      gameArea.ctx.fillText(`Score: ${gameArea.points}`, 270, 400);
      gameArea.ctx.font = '40px Architects Daughter';
      gameArea.ctx.fillText('PRESS ENTER TO RESTART', 200, 500);
      gameArea.ctx.font = '30px Architects Daughter';
      gameArea.ctx.fillText('YOUR HIGHEST SCORE:', 280, 100);
      gameArea.ctx.font = '50px Architects Daughter';
      gameArea.ctx.fillStyle = 'red';
      gameArea.ctx.fillText(`${highScore}`, 650, 100);
      controller.enter = false;
    }, 2000);
    themeSong.pause();
  }
}

const controller = {
  left: false,
  right: false,
  up: false,
  enter: false,
  keyListener(event) {
    const keyState = (event.type === 'keydown');

    // eslint-disable-next-line default-case
    switch (event.keyCode) {
      case 65:// A key - move left
        controller.left = keyState;
        break;
      case 32:// Space bar - jump
        controller.up = keyState;
        break;
      case 68:// D key - move right
        controller.right = keyState;
        break;
      case 13:// Enter key
        if (controller.enter === false) {
          resetGame();
          gameArea.start();
          controller.enter = true;
          themeSong.load();
          themeSong.play();
          break;
        }
    }
  },
};

window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);

const updateGameArea = () => {
  gameArea.clear();
  backgroundImage.draw();
  backgroundImage.move();
  gameArea.drawBoard();
  seal.newPos();
  seal.update();
  updateObstacles();
  updateObstacles2();
  fishes();
  gameArea.score();
  checkBonusPoints();
	checkGameOver();
	gameArea.frames += 1;
};

const resetGame = () => {
  gameArea.frames = 0;
  gameArea.points = 0;
  backgroundImage.x = 0;
  seal.x = 20;
  seal.y = 470;
  myObstacles = [];
  myObstacles2 = [];
  bonusPoints = [];
};

gameArea.menu();
