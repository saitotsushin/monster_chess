import PlayerData from '../object/PlayerData';

class TitleScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'TitleScene'
      });
  }
  preload() {
  }
  create() {
    let config = {
      key: 'title',
      frames: [{
        frame: 'title',
      }]
    };

    this.title_start = this.add.text(
      80,
      120,
      'START',
      { font: '10px Courier', fill: '#CCC' }
    );
    this.title_start.depth = 100;

    this.title_start.setInteractive();


    this.title_start.on('pointerdown', () => {
      const context = new AudioContext();      
      this.scene.start('MainScene');
    });
  }



//   startGame() {
//     this.scene.stop('GameScene');
//     this.scene.start('GameScene');
//   }


}

export default TitleScene;
