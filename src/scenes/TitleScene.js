
import LoadGameData   from '../data/LoadGameData';

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
    this.LoadGameData = new LoadGameData({
      scene: this
    });
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
      this.loadPlayerData();
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
  /*==============================
  プレイヤーデータロード
  ------------------------------*/  
  loadPlayerData(){
    /*自分のデータ*/
    this.registry.list.chessLayoutData = this.LoadGameData.chessLayoutData;
    this.registry.list.chessDataMaster  = this.LoadGameData.chessDataMaster;
    this.registry.list.chessData  = this.LoadGameData.chessData;
    this.registry.list.itemData  = this.LoadGameData.itemData;
    /*自分のストックしている駒のデータ*/
    this.registry.list.stockData  = this.LoadGameData.stockData;

    /*相手のデータ*/
    this.registry.list.chessLayoutData2 = this.LoadGameData.chessLayoutData2;
    this.registry.list.chessData2  = this.LoadGameData.chessData2;    
    this.registry.list.itemData2  = this.LoadGameData.itemData2;
  }
}

export default TitleScene;
