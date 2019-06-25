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
      this.ctx.drawImage(menuImg, 0, 0, 1000, 600);
      const menuLogo = document.getElementById('logo');
      this.ctx.drawImage(menuLogo, 150, 300, 700, 200);
      this.ctx.font = '30px Architects Daughter';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText('PRESS ENTER TO START', 320, 500);
    };
  },
  start() {
    this.interval = setInterval(updateGameArea, 1000 / 60);
  },
  drawBoard() {
    this.ctx.beginPath();
    const grd = this.ctx.createLinearGradient(0, 600, 0, 500);
    grd.addColorStop(0, '#20C3D0');
    grd.addColorStop(1, 'white');
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 500, 1000, 100);
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
    const bonusInterval = setInterval(() => this.ctx.fillText('+10', 535, 80), 1000 / 60);
    setTimeout(() => clearInterval(bonusInterval), 2000);
  },
};

// Background loop
const backgroundImage = {
  background: document.getElementById('background'),
  x: 0,
  speed: -1,
  move() {
    this.x += this.speed;
    this.x %= gameArea.canvas.width;
  },
  draw() {
    gameArea.ctx.drawImage(this.background, this.x, 0, 1000, 600);
    if (this.speed < 0) {
      gameArea.ctx.drawImage(this.background, this.x + gameArea.canvas.width, 0, 1000, 600);
    } else {
      gameArea.ctx.drawImage(this.background, this.x - this.background.width, 0, 1000, 600);
    }
  },
};

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
          break;
        }
    }
  },
};

window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);

class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.jumping = true;
  }

  updateEnemy() {
    const bear = document.getElementById('bear');
    gameArea.ctx.drawImage(bear, this.x, this.y, this.width, this.height);
  }

  updateEnemy2() {
    const killer = document.getElementById('killer');
    gameArea.ctx.drawImage(killer, this.x, this.y, this.width, this.height);
  }

  updatePlayer() {
    const sealImage = document.getElementById('seal');
    gameArea.ctx.drawImage(sealImage, this.x, this.y, this.width, this.height);
  }

  newPos() {
    // jump condition
    if (controller.up && this.jumping === false) {
      this.speedY -= 40;
      this.jumping = true;
    }
    if (controller.left) {
      this.speedX -= 3.5;
    }

    if (controller.right) {
      this.speedX += 3.5;
    }

    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 1.5; // gravity
    this.speedX *= 0.5; // friction
    this.speedY *= 0.9; // friction

    // Doesn't go trough the floor
    if (this.y > 470) {
      this.jumping = false;
      this.y = 470;
      this.speedY = 0;
    }

    // Doesn't go trough the borders
    if (this.x < 0) {
      this.x = 0;
      this.speedX = 0;
    } else if (this.x > 1000 - this.width) {
      this.x = 1000 - this.width;
      this.speedX = 0;
    }
  }

  left() {
    return this.x + 10;
  }

  right() {
    return this.x + this.width - 10;
  }

  top() {
    return this.y + 10;
  }

  bottom() {
    return this.y + this.height - 10;
  }

  crashWith(obstacle) {
    return (
      this.bottom() > obstacle.top()
      && this.top() < obstacle.bottom()
      && this.right() > obstacle.left()
      && this.left() < obstacle.right()
    );
  }
}

function checkGameOver() {
  const crashed = myObstacles.some(obstacle => seal.crashWith(obstacle));
  const crashed2 = myObstacles2.some(obstacle => seal.crashWith(obstacle));

  if (crashed || crashed2) {
    gameArea.stop();
    setTimeout(() => {
      const gameOverImg = document.getElementById('game-over');
      gameArea.ctx.drawImage(gameOverImg, 0, 0, 1000, 600);
      gameArea.ctx.font = '100px Architects Daughter';
      gameArea.ctx.fillStyle = 'black';
      gameArea.ctx.fillText(`GAME OVER`, 200, 200);
      gameArea.ctx.fillText(`Score: ${gameArea.points}`, 270, 400);
      gameArea.ctx.font = '40px Architects Daughter';
      gameArea.ctx.fillText('PRESS ENTER TO RESTART', 200, 500);
    }, 2000);
    controller.enter = false;
  }
}

const seal = new Player(20, 470, 60, 30);

let myObstacles = [];

function updateObstacles() {
  for (let i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -4;
    myObstacles[i].updateEnemy();
  }
  gameArea.frames += 1;
  if (gameArea.frames % Math.round(Math.random() * 1000) === 0) {
    myObstacles.push(new Player(1000, 460, 60, 50));
  }
}

let myObstacles2 = [];

function updateObstacles2() {
  if (myObstacles2.length >= 1) {
    for (let i = 0; i < myObstacles2.length; i += 1) {
      myObstacles2[i].y += myObstacles2[i].speedY;
      myObstacles2[i].x += myObstacles2[i].speedX;
      if (myObstacles2[i].x === 900) {
        myObstacles2[i].speedY = -70;
        myObstacles2[i].speedX = -Math.round(Math.random() * 10);
      }
      myObstacles2[i].speedY += 0.5;
      myObstacles2[i].speedY *= 0.9;
      myObstacles2[i].updateEnemy2();
    }
  }
  if (gameArea.frames % Math.round(Math.random() * 1000) === 0) {
    myObstacles2.push(new Player(900, 600, 100, 40));
  }
}

// Bonus points logic
class Fish extends Player {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.speedX = -Math.round(Math.random() * 5);
  }

  update() {
    const fish = document.getElementById('fish');
    gameArea.ctx.drawImage(fish, this.x, this.y, this.width, this.height);
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y === 50) {
      this.speedY = 4;
    } else if (this.y === 450) {
      this.speedY = -4;
    }
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }
}

let bonusPoints = [];

const fishes = () => {
  for (let i = 0; i < bonusPoints.length; i += 1) {
    bonusPoints[i].newPos();
    bonusPoints[i].update();
  }
  if (gameArea.frames % 240 === 0) {
    bonusPoints.push(new Fish(1000, 50, 30, 30));
  }
};

const checkBonusPoints = () => {
  let didYouGrab = false;
  let index = 0;
  for (let i = 0; i < bonusPoints.length; i += 1) {
    if (seal.crashWith(bonusPoints[i])) {
      didYouGrab = true;
      index = i;
    }
  }

  if (didYouGrab) {
    gameArea.scoreBonus();
    bonusPoints.splice(index, 1);
  }
};

const updateGameArea = () => {
  gameArea.clear();
  backgroundImage.draw();
  backgroundImage.move();
  gameArea.drawBoard();
  seal.newPos();
  seal.updatePlayer();
  updateObstacles();
  updateObstacles2();
  fishes();
  gameArea.score();
  checkBonusPoints();
  checkGameOver();
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
