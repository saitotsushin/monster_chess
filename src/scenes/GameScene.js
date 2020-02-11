import Monster from '../sprites/character/Monster';
import ComformMordal from '../ui/ComformMordal';
import StageManager from '../plugin/StageManager';
import StageData from '../plugin/StageData';

class GameScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'GameScene'
      });
  }
  create(){


    this.mode = "";

    this.turn = "player1";

    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');
    this.stageLayer = this.map.createDynamicLayer('stage', this.tileset, 0, 0);
    this.stageLayer.setCollisionBetween(0, 100);
    this.stageLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;

    this.stageLayer.x = (this.game.config.width - this.stageLayer.width) /2;
    this.stageLayer.y = (this.game.config.height - this.stageLayer.height) /2;

    this.stageManager = new StageManager({
      scene: this
    });
    this.stageData = new StageData();


    this.keys = {
      TOUCH_START:{
        x: 0,
        y: 0
      },
      TOUCH_END:{
        x: 0,
        y: 0
      },
      isTOUCH: false,
      isRELEASE: false
    };

    /*==============================
    モンスター
    ==============================*/        
    this.player1Chess1 = new Monster({
      scene: this,
      x: this.stageLayer.x,
      y: this.stageLayer.y,
      key: 'monster1',
      type: "player1"
    });

    this.player1Chess2 = new Monster({
      scene: this,
      x: this.stageLayer.x,
      y: this.stageLayer.y,
      key: 'monster2',
      type: "player1"
    });

    this.player1ChessGroup = this.add.group();

    this.player1ChessGroup.add(this.player1Chess1);
    this.player1ChessGroup.add(this.player1Chess2);

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
    this.player2Chess1.status.power = 10;
    this.player2Chess1.status.defense = 10;
    this.player2Chess2.status.power = 10;
    this.player2Chess2.status.defense = 10;

    this.player2ChessGroup = this.add.group();

    this.player2ChessGroup.add(this.player2Chess1);
    this.player2ChessGroup.add(this.player2Chess2);

    this.stageManager.initStage(this.stageData.tilePropertyArr);
    this.stageManager.initSetChess(this.player1ChessGroup,this.stageData.player1_Arr);
    this.stageManager.initSetChess(this.player2ChessGroup,this.stageData.player2_Arr);

    


    this.touchedTile;
    this.stageTileProperty;
    this.pickChess;
    this.monsterStatus;
    this.attackTarget;
    // this.stageTile;

    /*==============================
    ステージ
    ==============================*/    
    this.stageLayer.setInteractive();
    this.stageLayer.on('pointerdown', function (pointer) {
      /*----------------
      念の為に初期化
      ----------------*/
      this.touchedTile = null;
      this.tilePropertyData = null;

      this.touchedTile = this.getTilePosition();

      this.stageManager.touchedTile(this.touchedTile.localNumber.x,this.touchedTile.localNumber.y);


    },this);

    /*==============================
    UI
    ==============================*/        
    this.conformMordal = new ComformMordal({
      scene: this
    });

    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.add.text(10, 10, '', { font: '10px Courier', fill: '#FFFFFF' });
    this.debugText.depth = 100;
    this.debugText.setScrollFactor(0,0);

    this.marker = this.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(0, 0,this. map.tileWidth, this.map.tileHeight);
    this.marker.depth = 5;
  }

  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    this.debugText.setText(
      [
        'this.turn :'+this.turn,
      ]
    );

    /*------------------------------
    デバッグ END
    ==============================*/
  }
  
  getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
  };

  getTilePosition(){

    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    var pointerTileX = this.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.map.worldToTileY(worldPoint.y);

    // Snap to tile coordinates, but in world space
    this.marker.x = this.map.tileToWorldX(pointerTileX);
    this.marker.y = this.map.tileToWorldY(pointerTileY);
    var tile = this.map.getTileAt(pointerTileX, pointerTileY);

    let postion = {
      localNumber: {
        x: 0,
        y: 0  
      },
      world:{
        x: 0,
        y: 0  
      }
    }

    if (tile)
    {
        postion.world.x = tile.x * this.map.tileWidth + this.stageLayer.x;
        postion.world.y = tile.y * this.map.tileHeight + this.stageLayer.y;
        postion.localNumber.x = (postion.world.x - this.stageLayer.x) /this.map.tileWidth;
        postion.localNumber.y = (postion.world.y - this.stageLayer.y) /this.map.tileHeight;
        return postion;
    }
  }
  
}

export default GameScene;
