class Obstacles extends Player {
  constructor(x, y, width, height, name) {
    super(x, y, width, height);
    this.speedX = 0;
    this.speedY = 0;
    this.name = name;
  }

  update() {
    const enemy = document.getElementById(`${this.name}`);
    gameArea.ctx.drawImage(enemy, this.x, this.y, this.width, this.height);
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

let myObstacles = [];
let myObstacles2 = [];

function updateObstacles() {
  for (let i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -4;
    myObstacles[i].update();
  }

  if (gameArea.frames % Math.round(Math.random() * 700) === 0) {
    myObstacles.push(new Obstacles(1000, 460, 60, 50, 'bear'));
  }
}

function updateObstacles2() {
  if (myObstacles2.length >= 1) {
    for (let i = 0; i < myObstacles2.length; i += 1) {
      myObstacles2[i].y += myObstacles2[i].speedY;
      myObstacles2[i].x += myObstacles2[i].speedX;
      if (myObstacles2[i].x === 990) {
        myObstacles2[i].speedY = -70;
        myObstacles2[i].speedX = -Math.round(Math.random() * 10);
      }
      myObstacles2[i].speedY += 0.5;
      myObstacles2[i].speedY *= 0.9;
      myObstacles2[i].update();
    }
  }
  if (gameArea.frames % Math.round(Math.random() * 1500) === 0) {
    myObstacles2.push(new Obstacles(990, 600, 100, 40, 'killer'));
  }
}