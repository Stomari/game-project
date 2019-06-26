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
