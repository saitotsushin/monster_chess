// import ModalManager from '../object/ui/ModalManager';
// import StageManager from '../object/StageManager';
// import TrapManager from '../object/TrapManager';
// import PlayerManager from '../object/PlayerManager';
// import ChessManager from '../object/ChessManager';

class MainScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'MainScene'
    });
   
  }
  create(){
    this.btnGameScene = this.add.text(
      80,
      80,
      'GAME SCENE',
      { font: '10px Courier', fill: '#CCC' }
    );
    this.btnGameScene.setInteractive();
    this.btnGameScene.on('pointerdown', () => {
      this.scene.start('GameScene');
    },this);   


    this.btnMenu = this.add.text(
      80,
      140,
      'MENU SCENE',
      { font: '10px Courier', fill: '#CCC' }
    );
    this.btnMenu.setInteractive();
    this.btnMenu.on('pointerdown', () => {
      this.scene.start('MenuScene');
    },this);   

  }


}

export default MainScene;
