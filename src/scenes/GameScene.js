import Monster from '../sprites/character/Monster';
import ComformMordal from '../ui/ComformMordal';

class GameScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'GameScene'
      });
  }
  create(){

    /*==============================
    UI
    ==============================*/        
    this.conformMordal = new ComformMordal({
      scene: this
    }); 

    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');
    this.stageLayer = this.map.createDynamicLayer('stage', this.tileset, 0, 0);
    this.stageLayer.setCollisionBetween(0, 100);
    this.stageLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;

    this.stageLayer.x = (this.game.config.width - this.stageLayer.width) /2;
    this.stageLayer.y = (this.game.config.height - this.stageLayer.height) /2;



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
    this.monsterObj = new Monster({
      scene: this,
      x: this.stageLayer.x,
      y: this.stageLayer.y,
      key: 'monster'
    }); 
    this.monsterObj2 = new Monster({
      scene: this,
      x: this.stageLayer.x + 60,
      y: this.stageLayer.y + 90,
      key: 'monster'
    });

    this.monsterGroup = this.add.group();

    this.monsterGroup.add(this.monsterObj);
    this.monsterGroup.add(this.monsterObj2);

    // this.monsterObj.x = this.stageLayer.x + this.monsterObj.width/2;
    // this.monsterObj.y = this.stageLayer.y + this.monsterObj.height/2;

    this.stageLayer.setInteractive();
    this.stageLayer.on('pointerdown', function (pointer) {
      if(this.monsterObj.isPick){

      }
    },this);

    
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
        'monsterObj.before.x :'+this.monsterObj.beforePosition.x,
        'monsterObj.before.y :'+this.monsterObj.beforePosition.y,
      ]
    );


    // if (this.input.manager.activePointer.isDown)
    // {
    //   this.getTileProperties();

    // }
    /*------------------------------
    デバッグ END
    ==============================*/
  }
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
      x: 0,
      y: 0
    }

    if (tile)
    {
        postion.x = tile.x * this.map.tileWidth + this.stageLayer.x;
        postion.y = tile.y * this.map.tileHeight + this.stageLayer.y;
        return postion;
    }
  }


}

export default GameScene;
