import PlayerData from '../object/PlayerData';

class MainScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'MainScene'
    });
   
  }
  create(){
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
      this.scene.start('MenuScene');
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

    this.btnStageClear = this.add.text(
      80,
      160,
      'STAGE CLEAR SCENE',
      { font: '10px Courier', fill: '#CCC' }
    );
    this.btnStageClear.setInteractive();
    this.btnStageClear.on('pointerdown', () => {
      this.scene.start('StageClearScene');
    },this);   
    /*=================
    プレイヤーデータの呼び出し
    -------------------*/
    this.PlayerData = new PlayerData({
      scene: this
    });

    this.registry.set('player1_ChessList', []);
    this.registry.set('player1Auto_Arr', []);
    this.registry.set('stockChesses', []);
    this.registry.set('gameMode', []);
    this.registry.set('room', []);

    this.registry.list.player1_ChessList = this.PlayerData.player1_ChessList;
    this.registry.list.player1Auto_Arr = this.PlayerData.player1Auto_Arr;
    this.registry.list.stockChesses = this.PlayerData.stockChesses;
    this.registry.list.gameMode = "";
    
  }

}

export default MainScene;
