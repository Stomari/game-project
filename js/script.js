const gameArea = {
  canvas: document.createElement('canvas'),
  frames: 0,
  start() {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 1000 / 60);
  },
  drawBoard() {
    // const img = new Image();
    // img.src = './images/glacial_mountains_fullcolor_preview.png';
    // img.onload = () => {
    //   this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    // };
    this.ctx.beginPath();
    const grd = this.ctx.createLinearGradient(0, 600, 0, 500);
    grd.addColorStop(0, '#20C3D0');
    grd.addColorStop(1, 'white');
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 500, 800, 100);
    this.ctx.closePath();
  },
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    gameArea.ctx.drawImage(this.background, this.x, 0, 800, 600);
    if (this.speed < 0) {
      gameArea.ctx.drawImage(this.background, this.x + gameArea.canvas.width, 0, 800, 600);
    } else {
      gameArea.ctx.drawImage(this.background, this.x - this.background.width, 0, 800, 600);
    }
  },
};

const controller = {
  left: false,
  right: false,
  up: false,
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
    }
  },
};

window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);

class Player {
  constructor(x, y, width, heigth) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = heigth;
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
      this.speedY -= 70;
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
    this.speedY += 2.5; // gravity
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
    } else if (this.x > 800 - this.width) {
      this.x = 800 - this.width;
      this.speedX = 0;
    }
  }
}

const seal = new Player(20, 470, 60, 30);

const myObstacles = [];

function updateObstacles() {
  for (let i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -4;
    myObstacles[i].updateEnemy();
  }
  gameArea.frames += 1;
  if (gameArea.frames % Math.round(Math.random() * 2000) === 0) {
    myObstacles.push(new Player(800, 450, 60, 50));
  }
}

const myObstacles2 = [];

function updateObstacles2() {
  for (let i = 0; i < myObstacles.length; i += 1) {
    myObstacles2[i].y += myObstacles2[i].speedY;
    myObstacles2[i].x += myObstacles2[i].speedX;
    if (myObstacles2[i].x === 700) {
      myObstacles2[i].speedY = -70;
      myObstacles2[i].speedX = -Math.round(Math.random() * 10);
    }
    myObstacles2[i].speedY += 0.5;
    myObstacles2[i].speedY *= 0.9;
    myObstacles2[i].updateEnemy2();
  }
  gameArea.frames += 1;
  if (gameArea.frames % Math.round(Math.random() * 3000) === 0) {
    myObstacles2.push(new Player(700, 600, 100, 40));
  }
}

// document.onkeydown = (e) => {
//   // eslint-disable-next-line default-case
//   switch (e.keyCode) {
//     case 32: // space bar
//       // jump(?)
//       seal.jumping = false;
//       console.log(seal.jumping);
//       break;
//     case 65: // a keyboard
//       seal.speedX = -5;
//       break;
//     case 68: // d keyboard
//       seal.speedX = 5;
//       break;
//   }
// };

// document.onkeyup = (e) => {
//   seal.speedX = 0;
// };


const updateGameArea = () => {
  gameArea.clear();
  backgroundImage.draw();
  backgroundImage.move();
  gameArea.drawBoard();
  seal.newPos();
  seal.updatePlayer();
  updateObstacles();
  updateObstacles2();
};

const startGame = () => {
  gameArea.start();
};

startGame();
