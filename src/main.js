import 'phaser';

import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';
import MenuScene from './scenes/MenuScene';
import MainScene from './scenes/MainScene';
import StageClearScene from './scenes/StageClearScene';
import SettingScene from './scenes/SettingScene';
import SettingLayoutScene from './scenes/SettingLayoutScene';
import RoomScene from './scenes/RoomScene';




let BASE_WIDTH = 140;
let BASE_HEIGHT = 200;
let DEVICE_WIDTH = window.innerWidth;
let DEVICE_HEIGHT = window.innerHeight;
let wd;
let hi;
if(DEVICE_WIDTH >= DEVICE_HEIGHT){
  wd = BASE_WIDTH;
  hi = BASE_HEIGHT;
}else{
  wd = BASE_WIDTH/DEVICE_WIDTH;
  hi = DEVICE_HEIGHT * wd;  
}
const config = {
  type: Phaser.WEBGL,
  pixelArt: true,
  // roundPixels: true,
  parent: 'content',
  width: BASE_WIDTH,
  height: hi,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
          y: 0
      },
      // debug: true
    }
  },
  scene: [
    BootScene,
    TitleScene,
    RoomScene,
    MenuScene,
    SettingLayoutScene,
    SettingScene,
    GameScene,
    StageClearScene,
    MainScene
  ]
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
