import LoadGameData     from '../data/LoadGameData';
import CreateChessInfo    from '../object/game/CreateChessInfo';

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'GameScene'
    });
    this.LoadGameData = new LoadGameData();
    this.CreateChessInfo;
    console.log("GameScene")
  }
  create(){

    console.log("GameScene create")

    /*背景色*/
    this.cameras.main.setBackgroundColor('#000000');

    /*メニューボタン：ステージ１*/
    // this.btnPlayCPU = this.add.sprite(
    //   this.sys.game.config.width/2,
    //   0,
    //   'spritesheet',
    //   'btn_play_cpu'
    // );
    // this.btnPlayCPU = new Phaser.Geom.Rectangle(0, 0, this.sys.game.config.this.sys.game.config.game.config.width, this.sys.game.config.scene.game.config.height);
    // this.overlapArea.fillRectShape(this.rect);

    this.btnPlayCPU = this.add.text(10, 10, 'CPU対戦', {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10
    });
    // text.depth = 100;

    this.btnPlayCPU.setInteractive();
    this.btnPlayCPU.on('pointerdown', () => {
      this.registry.list.gameMode = "NPC";
      this.scene.start('BattleScene');
    },this);
    // this.btnPlayCPU.setOrigin(0.5,0);

    this.btnPlayOnline = this.add.text(
      10, 
      40, 
      'オンライン対戦', {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10
    });
    /*メニューボタン：オンライン*/
    // this.btnPlayOnline = this.add.sprite(
    //   this.sys.game.config.width/2,
    //   50,
    //   'spritesheet',
    //   'btn_play_online'
    // );
    

    this.btnPlayOnline.setInteractive();
    this.btnPlayOnline.on('pointerdown', () => {
      this.scene.start('RoomScene');
      this.registry.list.gameMode = "NET";
    },this);

    this.chessInfoGroup = this.add.group();

    this.CreateChessInfo = new CreateChessInfo({
      scene: this,
      addGroup: this.chessInfoGroup,
      chessData: this.registry.list.chessDataMaster//チェスデータ
    });       
  }    

}

export default GameScene;
