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
    this.cameras.main.setBackgroundColor('#CCCCCC');

    /*メニューボタン：ステージ１*/
    this.btnPlayCPU = this.add.sprite(
      this.sys.game.config.width/2,
      0,
      'spritesheet',
      'btn_play_cpu'
    );
    

    this.btnPlayCPU.setInteractive();
    this.btnPlayCPU.on('pointerdown', () => {
      this.registry.list.gameMode = "NPC";
      this.scene.start('BattleScene');
    },this);
    this.btnPlayCPU.setOrigin(0.5,0);


    /*メニューボタン：オンライン*/
    this.btnPlayOnline = this.add.sprite(
      this.sys.game.config.width/2,
      50,
      'spritesheet',
      'btn_play_online'
    );
    

    this.btnPlayOnline.setInteractive();
    this.btnPlayOnline.on('pointerdown', () => {
      this.scene.start('RoomScene');
      this.registry.list.gameMode = "NET";
    },this);
    this.btnPlayOnline.setOrigin(0.5,0);

    this.chessInfoGroup = this.add.group();

    this.CreateChessInfo = new CreateChessInfo({
      scene: this,
      addGroup: this.chessInfoGroup,
      chessData: this.registry.list.chessDataMaster//チェスデータ
    });       
  }    

}

export default GameScene;
