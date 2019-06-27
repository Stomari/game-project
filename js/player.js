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

  update() {
    const sealImage = document.getElementById('seal');
    gameArea.ctx.drawImage(sealImage, this.x, this.y, this.width, this.height);
  }

  newPos() {
    if (controller.up && this.jumping === false) {
      this.speedY -= 40;
      this.jumping = true;
      jumpAudio.play();
    }
    if (controller.left) {
      this.speedX -= 3.5;
    }
    if (controller.right) {
      this.speedX += 3.5;
    }

    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 1.5;
    this.speedX *= 0.5;
    this.speedY *= 0.9;

    if (this.y > 470) {
      this.jumping = false;
      this.y = 470;
      this.speedY = 0;
    }

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

const seal = new Player(20, 470, 60, 30);
