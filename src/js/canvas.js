import platformImageSrc from "../img/platform.png";
import platformImageSmallTallSrc from "../img/platformSmallTall.png";
import hills from "../img/hills.png";
import background from "../img/background.png";
// import spriteRunLeft from "../img/spriteRunLeft.png";
// import spriteRunRight from "../img/spriteRunRight.png";

import spriteRunLeft from "../img/aa_left_walk2_sheet_fixed.png";
import spriteRunRight from "../img/aa_right_walk2_sheet_fixed.png";


// import spriteStandLeft from "../img/spriteStandLeft.png";
// import spriteStandRight from "../img/spriteStandRight.png";

import spriteStandLeft from "../img/aa_left_stand_small_sheet.png";
import spriteStandRight from "../img/aa_right_stand_small_sheet.png";


import marioBackground from "../img/smb3.gif";
import cloud from "../img/cloud.png";

const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

//Controls
const SHIFT = 16;
const CTRL = 17;
const ALT = 18;
const WINDOWS_OPTION = 91;
const LEFTARROW = 37;
const RIGHTARROW = 39;
const SPACEBAR = 32;

//Environmental
const INITIAL_JUMPVELOCITY = 15;
const INITIAL_PLAYERSPEED = 5;
const HIGH_SPEED_FACTOR = 3;

let JUMPVELOCITY = INITIAL_JUMPVELOCITY;
let PLAYERSPEED = INITIAL_PLAYERSPEED;
const BACKGROUND_HILLS_PARALLAX_FACTOR = 0.66;

let hitSpaceCount = 0;
let gameTimer = 0;

// Define your game variables here
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
// Player object
let gravity = 0.5;

let spriteStandRightImage = createImage(spriteStandRight);
let spriteStandLeftImage = createImage(spriteStandLeft);
let spriteRunRightImage = createImage(spriteRunRight);
let spriteRunLeftImage = createImage(spriteRunLeft);

let smb3BackgroundImage = createImage(marioBackground);

//let spriteStandRightImage = createImage(spriteStandRight);

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

class Player {
  constructor() {
    this.speed = PLAYERSPEED;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    // this.width = 66;
    // this.height = 150;
    this.image = spriteStandRightImage;

    this.width = 77;
    //this.height = 333;
    this.height = this.image.height; 

    this.frames = 0;
    this.sprites = {
      stand: {
        right: spriteStandRightImage,
        left: spriteStandLeftImage,
        //cropWidth: 177,
        cropWidth: 77,
        //width: 66,
        width: 77
      },
      run: {
        right: spriteRunRightImage,
        left: spriteRunLeftImage,
        cropWidth: 161,
        width: 161
        //cropWidth: 341,
        //width: 127.875,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    //this.currentCropWidth = 177;
    this.currentCropWidth=77;
  }

  draw() {
    canvasCtx.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      333,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      //this.frames > 59 &&
      this.frames > 2 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames > 8 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    }
    this.draw();
    //sleep(1000);
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

class Cloud {
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

let platformImage = createImage(platformImageSrc);
let platformImageSmallTall = createImage(platformImageSmallTallSrc);
let player = new Player();
let platforms = [];
let clouds = [];
let genericObjects = [];
let lastKey = "";
let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function init() {
  platformImage = createImage(platformImageSrc);
  platformImageSmallTall = createImage(platformImageSmallTallSrc);
  // Load player image
  player = new Player();
  platforms = [
    new Platform({
      x:
        platformImage.width * 4 +
        300 -
        2 +
        platformImage.width -
        platformImageSmallTall.width,
      y: 270,
      image: platformImageSmallTall,
    }),
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
      x: platformImage.width * 3 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 700 - 2,
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
    })
  ];

  clouds = [
    new Cloud({
      x: 200,
      y: 0,
      image: createImage(cloud),
    }),
    new Cloud({
      x: 300,
      y: 0,
      image: createImage(cloud),
    })
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

// Game loop function
function gameLoop() {
  gameTimer++;
  //console.log(gameTimer);
  requestAnimationFrame(gameLoop);
  canvasCtx.fillStyle = "white";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  // clouds.forEach((cloud) => {
  //   cloud.draw();
  // })

  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -=
          player.speed * BACKGROUND_HILLS_PARALLAX_FACTOR;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x +=
          player.speed * BACKGROUND_HILLS_PARALLAX_FACTOR;
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
      hitSpaceCount = 0;
    }
  });

  //Sprite switching conditional
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  if (scrollOffset > platformImage.width * 5 + 300 - 2) {
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

addEventListener("keydown", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case LEFTARROW:
      console.log("left");
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case RIGHTARROW:
      console.log("right");
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case SPACEBAR:
      console.log("jump");
      hitSpaceCount++;
      if (hitSpaceCount == 1) player.velocity.y -= JUMPVELOCITY;
      //player.velocity.y -= JUMPVELOCITY; //This makes him jump mid air multiple times
      break;
    case SHIFT:
      console.log("shift");
      JUMPVELOCITY *= 1.3;
      PLAYERSPEED *= HIGH_SPEED_FACTOR;
      player.speed = PLAYERSPEED;
      break;
    case CTRL:
      console.log("ctrl");
      break;
    case ALT:
      console.log("alt");
      //PLAYERSPEED = PLAYERSPEED - 10;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case LEFTARROW:
      console.log("left");
      keys.left.pressed = false;
      break;
    case RIGHTARROW:
      console.log("right");
      keys.right.pressed = false;
      break;
    case SPACEBAR:
      console.log("jump");
      break;
    case SHIFT:
      console.log("shift");
      JUMPVELOCITY = INITIAL_JUMPVELOCITY;
      PLAYERSPEED = INITIAL_PLAYERSPEED;
      player.speed = PLAYERSPEED
      break;
    case CTRL:
      console.log("ctrl");
      break;
    case ALT:
      console.log("alt");
      break;      
  }
});
