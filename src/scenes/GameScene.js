class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'GameScene'
    });   
  }
  create(){

    /*背景色*/
    this.cameras.main.setBackgroundColor('#FFFFFF');

    /*ページタイトル*/
    this.title = this.add.bitmapText(
      this.game.config.width/2,
      16,
      'bitmapFont',
      'STAGE SELECT',
      10
    );
    this.title.setOrigin(0.5,0.5);

    /*メニューボタン：ステージ１*/
    this.btnStage1 = this.add.sprite(
      this.sys.game.config.width/2,
      32,
      'spritesheet',
      'btn_stage1'
    );
    

    this.btnStage1.setInteractive();
    this.btnStage1.on('pointerdown', () => {
      this.scene.start('BattleScene');
    },this);
    this.btnStage1.setOrigin(0.5,0);

    /*ページタイトル　オンライン*/
    this.titleOnline = this.add.bitmapText(
      this.game.config.width/2,
      102,
      'bitmapFont',
      'ONLINE',
      10
    );    
    this.titleOnline.setOrigin(0.5,0.5);

    /*メニューボタン：オンライン*/
    this.btnStage2 = this.add.sprite(
      this.sys.game.config.width/2,
      114,
      'spritesheet',
      'btn_start'
    );
    

    this.btnStage2.setInteractive();
    this.btnStage2.on('pointerdown', () => {
      this.scene.start('RoomScene');
      this.registry.list.gameMode = "NET";
    },this);
    this.btnStage2.setOrigin(0.5,0);
  
    /*メニューボタン：セッティング*/
    this.btnSetting = this.add.sprite(
      this.sys.game.config.width/2,
      170,
      'spritesheet',
      'btn_setting'
    );
    
    this.btnSetting.setInteractive();
    this.btnSetting.on('pointerdown', () => {
      this.scene.start('SettingScene');
    },this);
    this.btnSetting.setOrigin(0.5,0);

  }    

}

export default GameScene;
