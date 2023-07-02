import platformImageSrc from "../img/platform.png";
import hills from "../img/hills.png";
import background from "../img/background.png";

const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

// Define your game variables here

// Player object
let gravity = 0.5;

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 30;
    this.height = 30;
  }

  draw() {
    canvasCtx.fillStyle = "red";
    canvasCtx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    canvasCtx.drawImage(this.image, this.position.x, this.position.y);
  }
}
class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    canvasCtx.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

let platformImage = createImage(platformImageSrc);
let player = new Player();
let platforms = [
  new Platform({
    x: -1,
    y: 470,
    image: platformImage,
  }),
  new Platform({
    x: platformImage.width - 3,
    y: 470,
    image: platformImage,
  }),
  new Platform({
    x: platformImage.width * 2 + 100,
    y: 470,
    image: platformImage,
  }),
];

let genericObjects = [
  new GenericObject({
    x: -1,
    y: -1,
    image: createImage(background),
  }),
  new GenericObject({
    x: -1,
    y: -1,
    image: createImage(hills),
  }),
];

let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

function init() {
  platformImage = createImage(platformImageSrc);
  // Load player image
  player = new Player();
  platforms = [
    new Platform({
      x: -1,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width - 3,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 100,
      y: 470,
      image: platformImage,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background),
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills),
    }),
  ];

  keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
  };
}

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = true;
      break;
    case 39:
      console.log("right");
      keys.right.pressed = true;
      break;
    case 32:
      console.log("jump");
      player.velocity.y -= 6;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 39:
      console.log("right");
      keys.right.pressed = false;
      break;
    case 32:
      console.log("jump");
      player.velocity.y -= 6;
      break;
  }
});

let scrollOffset = 0;
// Game loop function
function gameLoop() {
  requestAnimationFrame(gameLoop);
  canvasCtx.fillStyle = "white";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  if (scrollOffset > 2000) {
    console.log("Winner");
  }

  if (player.position.y > canvas.height) {
    console.log("Loser");
    init();
  }
}

// Start the game loop
init();
gameLoop();
