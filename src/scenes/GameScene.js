
import Monster from '../sprites/character/Monster';
import ModalManager from '../ui/ModalManager';
import StageManager from '../plugin/StageManager';
import StageData from '../plugin/StageData';
import SetChess from '../plugin/SetChess';
import Player from '../plugin/Player';
import Trap from '../ui/Trap';
import TouchedTile from '../plugin/TouchedTile';

class GameScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'GameScene'
      });
  }
  create(){

    this.CHESS_STATUS = "";

    this.turn = "player1";

    this.STAGE_STATUS = "INIT";
    this.PLAYER_STATUS = "";

    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');
    this.stageLayer = this.map.createDynamicLayer('stage', this.tileset, 0, 0);
    this.stageLayer.setCollisionBetween(0, 100);
    this.stageLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;

    this.stageLayer.x = (this.game.config.width - this.stageLayer.width) /2;
    this.stageLayer.y = (this.game.config.height - this.stageLayer.height) /2;

    this.Player = new Player({
      scene: this
    });
    this.stageManager = new StageManager({
      scene: this
    });
    this.player1ChessGroup = this.add.group();
    this.stageData = new StageData();
    this.setChess = new SetChess({
      scene: this
    });


    this.player2Chess1 = new Monster({
      scene: this,
      x: this.stageLayer.x,
      y: this.stageLayer.y,
      key: 'monster1',
      type: "player2"
    });
    this.player2Chess2 = new Monster({
      scene: this,
      x: this.stageLayer.x,
      y: this.stageLayer.y,
      key: 'monster2',
      type: "player2"
    });
    this.player2Chess3 = new Monster({
      scene: this,
      x: this.stageLayer.x,
      y: this.stageLayer.y,
      key: 'monster3',
      type: "player2"
    });
    this.player2Chess4 = new Monster({
      scene: this,
      x: this.stageLayer.x,
      y: this.stageLayer.y,
      key: 'monster4',
      type: "player2"
    }); 
    this.player2Chess5 = new Monster({
      scene: this,
      x: this.stageLayer.x,
      y: this.stageLayer.y,
      key: 'monster5',
      type: "player2"
    });       
    this.player2Chess1.status.power = 10;
    this.player2Chess1.status.difence = 10;
    this.player2Chess2.status.power = 10;
    this.player2Chess2.status.difence = 10;

    this.player2ChessGroup = this.add.group();

    this.player2ChessGroup.add(this.player2Chess1);
    this.player2ChessGroup.add(this.player2Chess2);
    this.player2ChessGroup.add(this.player2Chess3);
    this.player2ChessGroup.add(this.player2Chess4);
    this.player2ChessGroup.add(this.player2Chess5);

    this.stageManager.initStage(this.stageData.tilePropertyArr);

    this.TouchedTile = new TouchedTile({
      scene: this
    });

    this.stageTileProperty;
    this.pickChess;
    this.monsterStatus;
    this.attackTarget;

    /*==============================
    ステージ
    ==============================*/    
    this.stageLayer.setInteractive();
    this.stageLayer.on('pointerdown', function (pointer) {


      let tilePos = this.TouchedTile.getTilePosition();

      this.stageManager.touchedPos = tilePos.localNumber;

      this.TouchedTile.setStageTile(tilePos.localNumber.x,tilePos.localNumber.y);


    },this);

    /*==============================
    UI
    ==============================*/        
    this.modalManager = new ModalManager({
      scene: this
    });
    /*オートの配置*/
    this.modalManager.layoutAuto.open();
    /*トラップ*/
    this.trap = new Trap({
      scene: this
    });
    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.add.text(10, 10, '', { font: '10px Courier', fill: '#FFFFFF' });
    this.debugText.depth = 100;
    this.debugText.setScrollFactor(0,0);
    this.debugText.alpha = 0.3;


  }

  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    this.debugText.setText(
      [
        'STAGE_STATUS :'+this.STAGE_STATUS,
        'CHESS_STATUS :'+this.CHESS_STATUS,
      ]
    );

    /*------------------------------
    デバッグ END
    ==============================*/
  }
  

}

export default GameScene;
