class TitleScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'TitleScene'
      });
  }
  create() {
    
    let config = {
      key: 'title',
      frames: [{
        frame: 'title',
      }]
    };

    /*タイトル*/
    let title = this.add.sprite(
      0,
      0,
      'spritesheet',
      'title'
    );
    title.setOrigin(0,0);

    /*メニューボタン：スタート*/
    this.btnMenu = this.add.sprite(
      this.sys.game.config.width/2,
      102,
      'spritesheet',
      'btn_start'
    );
    this.btnMenu.setInteractive();
    this.btnMenu.on('pointerdown', () => {
      this.scene.start('GameScene');
    },this);
    this.btnMenu.setOrigin(0.5,0);

    /*メニューボタン：HOW TO*/
    this.btnHowTo = this.add.sprite(
      this.sys.game.config.width/2,
      130,
      'spritesheet',
      'btn_howto'
    );
    this.btnHowTo.setInteractive();
    this.btnHowTo.on('pointerdown', () => {
      this.scene.start('MenuScene');
    },this);
    this.btnHowTo.setOrigin(0.5,0);
    
  }

}

export default TitleScene;
