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

      
      this.title = this.physics.add.sprite(160, 100, 'title');
      
      this.title_start = this.physics.add.sprite(160, 300, 'title_start').setScrollFactor(0, 0).setInteractive();;

      this.title_start.on('pointerdown', () => {
          this.startGame();
      });
  }



  startGame() {
      this.scene.stop('GameScene');
      this.scene.start('GameScene');
  }


}

export default TitleScene;
