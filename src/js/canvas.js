// import platformImageSrc from "../img/platform.png";
// import platformImageSmallTallSrc from "../img/platformSmallTall.png";

import platformImageSrc from "../img/GreenPlatform.png";
import platformImageSmallTallSrc from "../img/SingleIsland.png";

import greenPlat1 from "../img/GreenPlatform1.png";
import greenPlat2 from "../img/GreenPlatform2.png";
import greenPlat3 from "../img/GreenPlatform3.png";

import singlePlat1 from "../img/SingleIsland1.png"
import singlePlat2 from "../img/SingleIsland2.png"

import hills from "../img/Mushroom_Cave_L3.png";
import background from "../img/Mushroom_Cave_L1.png";
import cave1 from "../img/Mushroom_Cave_L1.png";
import cave2 from "../img/Mushroom_Cave_L2.png";
import cave3 from "../img/Mushroom_Cave_L3.png";
import cave4 from "../img/Mushroom_Cave_L4.png";

import harryrunright from "../img/PitfallHarry_RunRight.png";
import harryrunleft from "../img/PitfallHarry_RunLeft.png";
import harrystandright from "../img/PitfallHarry_StandRight.png";
import harrystandleft from "../img/PitfallHarry_StandLeft.png";

import waterdropletSrc from "../img/WaterDrop.png";
import waterdropSpriteSheetSrc from "../img/WaterDrop_Splash123456_166x182_60.png"

import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";

import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteStandRight from "../img/spriteStandRight.png";

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

//Sprite cutoffs
const STAND_IMAGE_CROP_WIDTH=177;
const STAND_IMAGE_WIDTH = 177;

const RUN_IMAGE_CROP_WIDTH=112;
const RUN_IMAGE_WIDTH=112;

const RUN_FRAMES = 4;
const STAND_FRAMES = 1;

//Water Droplet parameters
const DROPLET_HIT_BOTTOM = 150;
const DROPLET_SPLASH_WIDTH=166
const DROPLET_SPLASH_HEIGHT = 182;


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

// let spriteStandRightImage = createImage(spriteStandRight);
// let spriteStandLeftImage = createImage(spriteStandLeft);
// let spriteRunRightImage = createImage(spriteRunRight);
// let spriteRunLeftImage = createImage(spriteRunLeft);

let spriteStandRightImage = createImage(harrystandright);
let spriteStandLeftImage = createImage(harrystandleft);
let spriteRunRightImage = createImage(harryrunright);
let spriteRunLeftImage = createImage(harryrunleft);

let waterdropSpriteSheetImage = createImage(waterdropSpriteSheetSrc);
let waterdropletHangingFallingImage = createImage(waterdropletSrc);
let waterdropletSplashImage = createImage(waterdropSpriteSheetSrc);

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

class BackgroundAsset {
  constructor({ x, y, image, parallaxfactor, argWidth, argHeight }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.parallaxfactor = parallaxfactor;
    if(argWidth >0 && argHeight >0){
      this.width = argWidth;
      this.height = argHeight;  
    }else{
      this.width = image.width;
      this.height = image.height;  
    }
  }
  draw() {
    canvasCtx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}

class Player {
  constructor() {
    this.speed = PLAYERSPEED;
    this.position = {
      x: 200,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = STAND_IMAGE_WIDTH;
    this.image = spriteStandRightImage;
    this.height = this.image.height; 

    this.frames = 0;
    this.sprites = {
      stand: {
        right: spriteStandRightImage,
        left: spriteStandLeftImage,
        cropWidth: STAND_IMAGE_CROP_WIDTH,
        width: STAND_IMAGE_WIDTH,
        cycleframes: false
      },
      run: {
        right: spriteRunRightImage,
        left: spriteRunLeftImage,
        cropWidth: RUN_IMAGE_CROP_WIDTH,
        width: RUN_IMAGE_WIDTH,
        cycleframes: true
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth=STAND_IMAGE_WIDTH;
  }

  draw() {
    canvasCtx.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      this.image.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    //this.frames = 1;
    if( (this.currentSprite === this.sprites.stand.right ||
      this.currentSprite === this.sprites.stand.left) && this.sprites.stand.cycleframes===true ){
      this.frames++;
    }else{
      this.frames = 0;
    }      
    if( (this.currentSprite === this.sprites.run.right ||
      this.currentSprite === this.sprites.run.left) && this.sprites.run.cycleframes===true){
      this.frames++;
    }else{
      this.frames =0 ;
    }
    if ( //stand frames
      this.frames > STAND_FRAMES &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if ( //run frames
      this.frames > RUN_FRAMES &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class WaterDroplet{
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.velocity = {
      x: 0,
      y: 3,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;

    this.frames = 0;
    this.sprites = {
      hanging: {
        spriteImage: waterdropletHangingFallingImage,
        cropWidth: STAND_IMAGE_CROP_WIDTH,
        width: STAND_IMAGE_WIDTH,
      },
      falling: {
        spriteImage: waterdropletHangingFallingImage,
        cropWidth: RUN_IMAGE_CROP_WIDTH,
        width: RUN_IMAGE_WIDTH,
      },
      splatter: {
        spriteImage: waterdropletSplashImage,
        cropWidth: RUN_IMAGE_CROP_WIDTH,
        width: RUN_IMAGE_WIDTH,
      },
    };
    this.currentSprite = this.sprites.hanging.spriteImage;
    this.currentCropWidth=STAND_IMAGE_WIDTH;    
  }
  
  draw() {
    canvasCtx.drawImage(this.image, this.position.x, this.position.y);
  }
  update(){
    this.draw();
    this.position.y += this.velocity.y * (2+gravity);
    if (this.position.y > canvas.height-DROPLET_HIT_BOTTOM) {
      this.position.y = 0;
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

let cave1Image = createImage(cave1);
let cave2Image = createImage(cave2);
let cave3Image = createImage(cave3);
let cave4Image = createImage(cave4);

let player = new Player();
let platforms = [];
let backgroundAssets = [];
let clouds = [];
let genericObjects = [];
let waterdroplets = [];
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
  cave1Image = createImage(cave1);
  cave2Image = createImage(cave2);
  cave3Image = createImage(cave3);
  cave4Image = createImage(cave4);

  waterdropletHangingFallingImage = createImage(waterdropletSrc);

  // Load player image
  player = new Player();
  backgroundAssets = [
    new BackgroundAsset({
      x: 0,
      y: 0,
      image: cave1Image,
      parallaxfactor: 0.05,
      argWidth: 8192,
      argHeight: 1024
    }),    
    new BackgroundAsset({
      x: 0,
      y: 0,
      image: cave2Image,
      parallaxfactor: 0.1,
      argWidth: 8192,
      argHeight: 1024
    }),
    new BackgroundAsset({
      x: 0,
      y: 0,
      image: cave3Image,
      parallaxfactor: 0.4,
      argWidth: 8192,
      argHeight: 1024
    }),
    new BackgroundAsset({
      x: 0,
      y: 0,
      image: cave4Image,
      parallaxfactor: 0.5,
      argWidth: 8192,
      argHeight: 1024
    })    
  ];
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

  waterdroplets = [
    new WaterDroplet({
      x:400,
      y:10,
      image: waterdropletHangingFallingImage
    })
  ]

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

  backgroundAssets.forEach((bg) => {
    bg.draw();
  });

  // genericObjects.forEach((genericObject) => {
  //   genericObject.draw();
  // });

  platforms.forEach((platform) => {
    platform.draw();
  });

  waterdroplets.forEach((waterdroplet) => {
    waterdroplet.update();
  });

  player.update();

  //What to do when the player is facing right or left or moving in that direction
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
      backgroundAssets.forEach((bgAsset) => {
        bgAsset.position.x -= player.speed * bgAsset.parallaxfactor;
      });
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -=
          player.speed * BACKGROUND_HILLS_PARALLAX_FACTOR;
      });
      waterdroplets.forEach((waterdroplet) => {
        waterdroplet.position.x -= player.speed;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      backgroundAssets.forEach((bgAsset) => {
        bgAsset.position.x += player.speed * bgAsset.parallaxfactor;
      });      
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x +=
          player.speed * BACKGROUND_HILLS_PARALLAX_FACTOR;
      });
      waterdroplets.forEach((waterdroplet) => {
        waterdroplet.position.x += player.speed;
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
      if (hitSpaceCount === 1) player.velocity.y -= JUMPVELOCITY;
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
      //PLAYERSPEED = PLAYERSPEED - 10; //Attempt at slowing down but not needed really 
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
