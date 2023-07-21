// import platformImageSrc from "../img/platform.png";
// import platformImageSmallTallSrc from "../img/platformSmallTall.png";

import platformImageSrc from "../img/GreenPlatform.png";
import platformImageSmallTallSrc from "../img/SingleIsland.png";

import ropeImageSrc from "../img/Rope.png";

import bottomPlatformImageSrc from "../img/BottomPlatform.png";
import stumpPlatformImageSrc from "../img/StumpPlatform.png";
import inclinePlatformImageSrc from "../img/InclinePlatform.png";

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

//576x144, 96x144
import boystandrightSrc from "../img/BoyStandRight_Sheet.png";
import boystandleftSrc from "../img/BoyStandLeft_Sheet.png";
import boywalkrightSrc from "../img/BoyWalkRight_Sheet.png";
import boywalkleftSrc from "../img/BoyWalkLeft_Sheet.png";
import boyjumprightSrc from "../img/BoyJumpRight_Sheet2.png";
import boyjumpleftSrc from "../img/BoyJumpLeft_Sheet2.png";


import waterdropletSrc from "../img/WaterDrop_2.png";
import waterdropSpriteSheetSrc from "../img/WaterDrop_Splash123456_166x182_60.png";
import splashMP3 from "../sounds/splash.mp3";

import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";

import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteStandRight from "../img/spriteStandRight.png";

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
const INITIAL_JUMPVELOCITY = 12;
const INITIAL_PLAYERSPEED = 5;
const HIGH_SPEED_FACTOR = 3;

let JUMPVELOCITY = INITIAL_JUMPVELOCITY;
let PLAYERSPEED = INITIAL_PLAYERSPEED;
const BACKGROUND_HILLS_PARALLAX_FACTOR = 0.66;

const PLATFORM_GROUND = 540;
//Sprite cutoffs
//Harry
// const STAND_IMAGE_CROP_WIDTH=177;
// const STAND_IMAGE_WIDTH = 177;

//Boy
const STAND_IMAGE_CROP_WIDTH=96;
const STAND_IMAGE_WIDTH = 96;

// const RUN_IMAGE_CROP_WIDTH=112;
// const RUN_IMAGE_WIDTH=112;
const RUN_IMAGE_CROP_WIDTH=100;
const RUN_IMAGE_WIDTH=100;
 
const RUN_FRAMES = 6;
const STAND_FRAMES = 2;

//Water Droplet parameters
const SINGLE_DROPLET_HEIGHT = 55;
const DROPLET_HIT_BOTTOM = PLATFORM_GROUND-42;
const DROPLET_SPLASH_WIDTH=166
const DROPLET_SPLASH_CROPWIDTH=166;
const DROPLET_SPLASH_HEIGHT = 182;
const DROPLET_SPLASH_FRAMES = 60;

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

// let spriteStandRightImage = createImage(harrystandright);
// let spriteStandLeftImage = createImage(harrystandleft);
//    yourImg.style.height = '100px';
//    yourImg.style.width = '200px';

let spriteStandRightImage = createImage(boystandrightSrc);

let spriteStandLeftImage = createImage(boystandleftSrc);

// let spriteRunRightImage = createImage(harryrunright);
// let spriteRunLeftImage = createImage(harryrunleft);
let spriteRunRightImage = createImage(boywalkrightSrc);
let spriteRunLeftImage = createImage(boywalkleftSrc);

let spriteJumpRightImage = createImage(boyjumprightSrc);
let spriteJumpLeftImage = createImage(boyjumpleftSrc);

let waterdropSpriteSheetImage = createImage(waterdropSpriteSheetSrc);
let waterdropletHangingFallingImage = createImage(waterdropletSrc);
let waterdropletSplashImage = createImage(waterdropSpriteSheetSrc);

const splashSound = new Audio(splashMP3);
//splashSound.src = "../sounds/splash.mp3";

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
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
      x: 600,
      y: 400,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = STAND_IMAGE_WIDTH;
    this.image = spriteStandLeftImage;
    this.height = this.image.height; 
    this.collisiondetection = {
      footadjustment: 11
    }

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
      jump:{
        frames: 6,
        right: spriteJumpRightImage,
        left: spriteJumpLeftImage,
        cropWidth: 92,
        width: 92,
        cycleframes: true
      }
    };
    this.currentSprite = this.sprites.stand.left;
    this.currentCropWidth=STAND_IMAGE_WIDTH;    
  }

  draw() {
    canvasCtx.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      this.currentSprite.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    this.width = 50;
    this.height = 70;
    // this.currentCropWidth *=0.5;
    // this.width *= 0.5;
    if( (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left || this.currentSprite===this.sprites.jump.right || this.currentSprite===this.sprites.jump.left) && this.sprites.stand.cycleframes===false ){
       this.frames=0;
    }

    if ( this.frames > STAND_FRAMES && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) {
      this.frames = 0;
    } else if ( this.frames > RUN_FRAMES && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) {
      this.frames = 0;
    } else if ( this.frames > this.sprites.jump.frames && ( this.currentSprite===this.sprites.jump.right || this.currentSprite===this.sprites.jump.left)){
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
  constructor({ x, y, image, argSplashBottom }) {
    this.position = {
      x,
      y,
    };
    this.velocity = {
      x: 0,
      y: 7,
    };
    this.splashBottom = argSplashBottom || DROPLET_HIT_BOTTOM;
    this.startY = this.position.y;
    this.image = image;
    this.width = image.width;
    this.height = image.height;
    this.size = 0.03;    
    this.frames = 0;
    this.jigglefactor = 0;
    this.hangingStartSize = 0.01;
    this.hangingEndSizeFactor = 0.5;
    this.splashSkipFrames = 3;

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
  
  drawHanging(){
    console.log("===================================draw hang");
    canvasCtx.drawImage(this.currentSprite, this.position.x, this.position.y+this.jigglefactor,this.image.width*this.size,this.image.height*this.size);
  }

  drawFalling() {
    console.log("===================================draw fall");
    canvasCtx.drawImage(this.currentSprite, this.position.x, this.position.y);
  }

  drawSplash(){
    console.log("===================================draw splash");
    console.log("splash frames=" + this.frames);
    canvasCtx.drawImage(
      this.currentSprite,
      DROPLET_SPLASH_WIDTH * this.frames,
      0,
      DROPLET_SPLASH_WIDTH,
      this.currentSprite.height,
      this.position.x-(DROPLET_SPLASH_WIDTH/2)+15,
      this.position.y-this.currentSprite.height+SINGLE_DROPLET_HEIGHT, //55 is hte height of the single drop which we just happen to know
      DROPLET_SPLASH_WIDTH,
      this.currentSprite.height
    );
    if(this.frames>DROPLET_SPLASH_FRAMES){
      this.position.y = this.startY;
      this.frames = 0;
      this.size=this.hangingStartSize;
    }
  }

  update(){
    if( this.position.y===this.startY ){      //hanging/jiggling/growing    
      this.currentSprite = this.sprites.hanging.spriteImage; 
      this.frames = 0;
      let sizeFactor = getRandomInt(9);      
      this.size+=(sizeFactor/500);
      //this.size+=(sizeFactor/((getRandomInt(10))*100)); // Randomize droplet growth
      this.drawHanging();      
      this.jigglefactor = (gameTimer%2===0) ? + (getRandomInt(7)*this.size) : (-1*(getRandomInt(7))*this.size);
      if(this.size>=this.hangingEndSizeFactor){
        this.position.y += this.velocity.y * (2+gravity);
      }
    //}else if (this.position.y >= canvas.height-this.splashBottom && this.frames>=0) {  //splash
  }else if (this.position.y >= this.splashBottom && this.frames>=0) {  //splash
      this.currentSprite = this.sprites.splatter.spriteImage;
      this.frames+=this.splashSkipFrames;
      //this.position.y=canvas.height-this.splashBottom;
      this.position.y=this.splashBottom;
      this.drawSplash();
      //if(this.frames>=10) splashSound.play();
    //}else if(this.position.y>this.startY && this.position.y < canvas.height-this.splashBottom ){     //falling      
  }else if(this.position.y>this.startY && this.position.y < this.splashBottom ){     //falling        
      this.currentSprite = this.sprites.falling.spriteImage;
      this.position.y += this.velocity.y * (2+gravity);
      this.drawFalling();
    }    
  }  
}

class Platform {
  constructor({ x, y, image, argFoothold, argWidth, argHeight }) {
    this.position = {
      x,
      y : y || PLATFORM_GROUND,
    };
    this.image = image;
    if(argWidth >0 && argHeight >0){
      this.width = argWidth;
      this.height = argHeight;  
    }else{
      this.width = image.width;
      this.height = image.height;  
    }
    this.foothold = (argFoothold!=undefined) ? argFoothold: 15;
  }
  draw() {
    canvasCtx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}

class Rope {
  constructor({ x, y, image, argFoothold, argWidth, argHeight }) {
    this.position = {
      x,
      y : y || PLATFORM_GROUND,
    };
    this.image = image;
    if( argWidth >0 ){
      this.width = argWidth;
    }else{
      this.width = image.width;
    }
    if( argHeight >0){
      this.height = argHeight;  
    }else{
      this.height = image.height;   
    }
    this.foothold = (argFoothold!=undefined) ? argFoothold: 15;
  }
  draw() {
    canvasCtx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
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

let bottomPlatformImage = createImage(bottomPlatformImageSrc);
let stumpPlatformImage = createImage(stumpPlatformImageSrc);
let inclinePlatformImage = createImage(inclinePlatformImageSrc);

let ropeImage = createImage(ropeImageSrc);

let platformImage = createImage(platformImageSrc);
let platformImageSmallTall = createImage(platformImageSmallTallSrc);

let cave1Image = createImage(cave1);
let cave2Image = createImage(cave2);
let cave3Image = createImage(cave3);
let cave4Image = createImage(cave4);

let player = new Player();
let platforms = [];
let ropes = [];
let backgroundAssets = [];

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
  jump: {
    pressed: false,
  }
};

let scrollOffset = 0;

function init() {
  

  bottomPlatformImage = createImage(bottomPlatformImageSrc);
  stumpPlatformImage = createImage(stumpPlatformImageSrc);
  inclinePlatformImage = createImage(inclinePlatformImageSrc);
  ropeImage = createImage(ropeImageSrc); 

  platformImage = createImage(platformImageSrc);
  platformImageSmallTall = createImage(platformImageSmallTallSrc);
  cave1Image = createImage(cave1);
  cave2Image = createImage(cave2);
  cave3Image = createImage(cave3);
  cave4Image = createImage(cave4);

  waterdropletHangingFallingImage = createImage(waterdropletSrc);
  waterdropletSplashImage = createImage(waterdropSpriteSheetSrc);

  spriteJumpRightImage = createImage(boyjumprightSrc);
  spriteJumpLeftImage = createImage(boyjumpleftSrc);

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
      x: 0,        
      y: 5,
      image: stumpPlatformImage,
      argWidth : 100,
      argHeight: 100,
      argFoothold: 15
    }),
    new Platform({
      x: 0,        
      y: 0,
      image: stumpPlatformImage,
      argWidth : 100,
      argHeight: 100,
      argFoothold: 15
    }),
    new Platform({
      x: 0,        
      y: 70,
      image: stumpPlatformImage,
      argWidth : 100,
      argHeight: 100,
      argFoothold: 15
    }),
    new Platform({
      x: 300,        
      y: 70,
      image: bottomPlatformImage,
      argWidth : 900,
      argHeight: 30,
      argFoothold: 15
    }),
    new Platform({
      x: 0,
      y: 270,
      image: bottomPlatformImage,
      argWidth: 300,
      argHeight: 45,
      argFoothold: 15
    }),
    new Platform({
      x: 400,
      y: 270,
      image: bottomPlatformImage,
      argWidth: 600,
      argHeight: 45,
      argFoothold: 15
    }),
    new Platform({
      x: 0,        
      y: 170,
      image: stumpPlatformImage,
      argWidth : 100,
      argHeight: 100,
      argFoothold: 15
    }),
    new Platform({
      x: 0,        
      y: 270,
      image: stumpPlatformImage,
      argWidth : 100,
      argHeight: 100,
      argFoothold: 15
    }),
    new Platform({
      x: 0,        
      y: 370,
      image: stumpPlatformImage,
      argWidth : 100,
      argHeight: 100,
      argFoothold: 15
    }),
    new Platform({
      x: 0,        
      y: 470,
      image: stumpPlatformImage,
      argWidth : 100,
      argHeight: 100,
      argFoothold: 15
    }),    
    new Platform({
      x: 0,
      image: bottomPlatformImage,
      argWidth: 1500,
      argHeight: 125,
      argFoothold: 25
    }),
    new Platform({
      x: 1700,
      image: platformImage,
    }),
  ];

  ropes = [
    new Rope({
      x: 220,
      y: 300,
      argHeight: 125,
      image: ropeImage,
      argFoothold: 125
    })
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
      x:140,
      y:10,
      image: waterdropletHangingFallingImage,
      argSplashBottom: 225
    }),
    new WaterDroplet({
      x:340,
      y:10,
      image: waterdropletHangingFallingImage,
      argSplashBottom: 225
    }),    
    new WaterDroplet({
      x:140,
      y:300,
      image: waterdropletHangingFallingImage
    }),    
    new WaterDroplet({
      x:400,
      y:30,
      image: waterdropletHangingFallingImage
    }),
    new WaterDroplet({
      x:1100,
      y:10,
      image: waterdropletHangingFallingImage
    }),
    new WaterDroplet({
      x:300,
      y:50,
      image: waterdropletHangingFallingImage
    }),    
    new WaterDroplet({
      x:400,
      y:300,
      image: waterdropletHangingFallingImage
    }),
    new WaterDroplet({
      x:500,
      y:10,
      image: waterdropletHangingFallingImage
    }),
    new WaterDroplet({
      x:600,
      y:100,
      image: waterdropletHangingFallingImage
    }),    
    new WaterDroplet({
      x:700,
      y:30,
      image: waterdropletHangingFallingImage
    })    
  ]

  keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
    jump: {
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

  platforms.forEach((platform) => {
    platform.draw();
  });

  ropes.forEach((rope) => {
    rope.draw();
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
      ropes.forEach((rope) => {
        rope.position.x -= player.speed;
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
      ropes.forEach((rope) => {
        rope.position.x += player.speed;
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

  //Collision detection with platforms and player
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y+platform.foothold &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y+platform.foothold &&
      player.position.x + player.width-player.collisiondetection.footadjustment >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width-player.collisiondetection.footadjustment
    ) {
      player.velocity.y = 0;
      hitSpaceCount = 0;
    }
  });

  //Sprite switching conditional
  if ( keys.right.pressed && lastKey === "right" && player.currentSprite !== player.sprites.run.right) {
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if ( keys.left.pressed && lastKey === "left" && player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if ( !keys.left.pressed && lastKey === "left" && player.currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth; 
    player.width = player.sprites.stand.width;
  } else if ( !keys.right.pressed && lastKey === "right" && player.currentSprite !== player.sprites.stand.right) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if( keys.jump.pressed && lastKey==="jump" && player.currentSprite !== player.sprites.jump.right){
    player.currentSprite = player.sprites.jump.right;
    player.currentCropWidth = player.sprites.jump.cropWidth;
    player.width = player.sprites.jump.width;
  } else if( keys.jump.pressed && lastKey==="jump" && player.currentSprite !== player.sprites.jump.left){
    player.currentSprite = player.sprites.jump.left;
    player.currentCropWidth = player.sprites.jump.cropWidth;
    player.width = player.sprites.jump.width;
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
      if (hitSpaceCount === 1) {
        keys.jump.pressed = true;
        lastKey = "jump";
        player.velocity.y -= JUMPVELOCITY;
      }
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
      keys.jump.pressed = false;
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
