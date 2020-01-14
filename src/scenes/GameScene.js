import Monster from '../sprites/character/Monster';

class GameScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'GameScene'
      });
  }
  create(){
    

    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');
    this.stageLayer = this.map.createDynamicLayer('stage', this.tileset, 0, 0);
    this.stageLayer.setCollisionBetween(0, 100);
    this.stageLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;

    this.stageLayer.x = (this.game.config.width - this.stageLayer.width) /2;
    this.stageLayer.y = (this.game.config.height - this.stageLayer.height) /2;

    this.monsterObj = new Monster({
      scene: this,
      key: 'monster'
    }); 

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
    this.monsterObj.x = this.stageLayer.x + this.monsterObj.width/2;
    this.monsterObj.y = this.stageLayer.y + this.monsterObj.height/2;
    this.monsterObj.setInteractive();

    /*==============================
    モンスターの移動エリアの表示
    ==============================*/    
    this.monsterObj.moveAreaMap = 
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,1,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,1,2,1,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];

    /*==============================
    モンスターの移動エリアの表示（コンテナー設定）
    ==============================*/       
    this.monsterObj.moveAreaCourser = this.add.container();

    for(var i = 0; i < this.monsterObj.moveAreaMap.length; i++){
      for(var k = 0; k < this.monsterObj.moveAreaMap[i].length; k++){

        if(this.monsterObj.moveAreaMap[i][k] === 1){
          let moveTile = this.add.graphics(
            {
              fillStyle: { color: 0xFF0000 }
            }      
          );
          let moveTileFill = new Phaser.Geom.Rectangle();
          moveTileFill.x = k * this.map.tileWidth;
          moveTileFill.y = i * this.map.tileHeight;
          moveTileFill.width = this.map.tileWidth;
          moveTileFill.height = this.map.tileHeight;
          moveTile.alpha = 0.4;
          moveTile.fillRectShape(moveTileFill);
          this.monsterObj.moveAreaCourser.add(moveTile);
  
        }
    
      }
    }
    this.monsterObj.moveAreaCourser.setVisible(false);
    this.monsterObj.moveAreaCourser.setActive(false);

    /*==============================
    モンスターの移動の操作
    ==============================*/      
    this.monsterObj.isPick = false;

    this.monsterObj.on('pointerdown', function (pointer) {
      if(!this.monsterObj.isPick){
        this.monsterObj.alpha = 0.5;
        this.setMoveArea();
      }
      this.monsterObj.isPick = true;
    },this);

    this.stageLayer.setInteractive();
    this.stageLayer.on('pointerdown', function (pointer) {
      if(this.monsterObj.isPick){
        let titlePosition = this.getTilePosition();
        this.monsterObj.alpha = 1;
        this.monsterObj.x = titlePosition.x + this.monsterObj.width/2;
        this.monsterObj.y = titlePosition.y + this.monsterObj.height/2;
        this.monsterObj.isPick = false;  
        this.setMoveArea();
      }
    },this);

    
    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.add.text(10, 40, '', { font: '10px Courier', fill: '#FFFFFF' });
    this.debugText.depth = 100;
    this.debugText.setScrollFactor(0,0);
    this.marker = this.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(0, 0,this. map.tileWidth, this.map.tileHeight);
  }

  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    // this.debugText.setText(
    //   [
    //     'monsterObj.isPick :'+this.monsterObj.isPick,
    //   ]
    // );


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
        // Note: JSON.stringify will convert the object tile properties to a string
        // this.debugText.setText('Properties: ' + JSON.stringify(tile.properties));
        // tile.properties.viewed = true;
        console.log("tile.tileWidth",tile.tileWidth)
        postion.x = tile.x * this.map.tileWidth + this.stageLayer.x;
        postion.y = tile.y * this.map.tileHeight + this.stageLayer.y;
        this.debugText.setText(
          [
            'Properties.x: ' + postion.x,
            'Properties.y: ' + postion.y
          ],
        );
        return postion;
    }
  }
  setMoveArea(){
    this.monsterObj.moveAreaCourser.setVisible(true);
    this.monsterObj.moveAreaCourser.setActive(true);
    this.monsterObj.moveAreaCourser.width = this.monsterObj.moveAreaMap[0].length * this.map.tileWidth;
    this.monsterObj.moveAreaCourser.height = this.monsterObj.moveAreaMap.length * this.map.tileHeight;
    this.monsterObj.moveAreaCourser.x = this.monsterObj.x - this.monsterObj.moveAreaCourser.width/2;
    this.monsterObj.moveAreaCourser.y = this.monsterObj.y - this.monsterObj.moveAreaCourser.height/2 + this.monsterObj.height/2;
  }
  removeMoveArea(){
    this.monsterObj.moveAreaCourser.setVisible(false);
    this.monsterObj.moveAreaCourser.setActive(false);    
  }
}

export default GameScene;
