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

    this.registry.set('player1_ChessList', []);
    this.registry.set('player1Auto_Arr', []);
    // this.registry.set('chessCost', 0);
        

      
    this.title_start.on('pointerdown', () => {
        this.scene.start('MainScene');
        // this.startGame();
    });
  }



//   startGame() {
//     this.scene.stop('GameScene');
//     this.scene.start('GameScene');
//   }


}

export default TitleScene;
