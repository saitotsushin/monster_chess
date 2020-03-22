import * as Func from '../../utils/Func';
export default class Base extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key,config.frame,config.playerType);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.playerType = config.playerType;
    /*==============================
    モンスターの移動エリアの表示
    ==============================*/    
    this.moveAreaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,1,9,1,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];
    this.attackAreaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,2,2,2,0,0,0,0],
      [0,0,0,0,0,2,0,0,0,0,0],
      [0,0,0,0,0,9,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];
    this.areaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,9,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];

    this.areaMap = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],      
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]      
    ];

    this.name = config.key;
    this.status = {
      hp: 5,
      maxHp: 5,
      power: 4,
      difence: 1
    }
    this.pos = {
      X: 0,
      Y: 0
    }
    this.depth = 10;
    this.damageText = this.scene.add.text(
      this.x + this.width/2 - 10,
      this.y + this.height/2 - 10,
      '0',
      { font: '15px Courier', fill: '#FF0000' }
    ); 
    this.damageText.depth = 12;
    this.damageText.setVisible(false);
    this.on('pointerdown', function (pointer) {
      this.scene.StageManager.selectedLayoutChess(this);
      this.cursorShow(pointer);
    });
    // this.selectedChessMarker = this.scene.add.graphics();
    // this.selectedChessMarker.lineStyle(3, 0xff0000, 1);
    // this.selectedChessMarker.strokeRect(
    //   0,
    //   0,
    //   config.scene.map.tileWidth,
    //   config.scene.map.tileHeight
    // );
    // this.selectedChessMarker.depth = 110;
    // this.selectedChessMarker.setVisible(false);

    this.icon_enemy = this.scene.add.sprite(this.x,this.y,'icon_enemy');
    this.icon_enemy.setVisible(false);
    this.icon_enemy.depth = 20;
    if(this.playerType === 'player2'){
      this.icon_enemy.setVisible(true);
    }
  }

  mergeArea(area1,area2,merge_area){

    for(var i = 0; i < area1.length; i++){
      for(var k = 0; k < area1[i].length; k++){
        if(area1[i][k] + area2[i][k] > 9){
          //中心点は9にしておく
          merge_area[i][k] = 9;
        }else{
          merge_area[i][k] = area1[i][k] + area2[i][k];
        }
      }

    }
    return merge_area;

  }
  move(position,int){
    this.x = position.x;
    this.y = position.y;
    this.pos.X = int.X;
    this.pos.Y = int.Y;
    if(this.playerType === 'player2'){
      this.icon_enemy.x = position.x;
      this.icon_enemy.y = position.y;
    }
  }
  attack(attackingTarget){

    let damagePoint = this.status.power - attackingTarget.status.difence;

    if(damagePoint <= 0){
      damagePoint = Func.getRandomInt(0,1);
    }
    attackingTarget.damage(damagePoint);
    attackingTarget.status.hp -= damagePoint;

    if(attackingTarget.status.hp <= 0){
      this.scene.StageManager.removeChess(attackingTarget);
    } 
  }
  damage(damagePoint){
    this.damageText.x = this.x + 10;
    this.damageText.y = this.y - 10;

    let afterY = this.damageText.y + 10;
    this.damageText.setVisible(true);
    this.damageText.setText(damagePoint);
    let damageTween = this.scene.tweens.add({
        targets: this.damageText,
        y: afterY,
        ease: 'liner',
        duration: 100,
        repeat: 0,
        completeDelay: 1000,
        onComplete: function () {
          this.damageText.setVisible(false);
        },
        callbackScope: this
    });
  }
  cursorShow(pointer){
    // var worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);

    // var pointerTileX = this.scene.map.worldToTileX(worldPoint.x);
    // var pointerTileY = this.scene.map.worldToTileY(worldPoint.y);

    // let test_x = this.scene.map.tileToWorldX(pointerTileX);
    // let test_y  = this.scene.map.tileToWorldY(pointerTileY);
    // var tile = this.scene.map.getTileAt(pointerTileX, pointerTileY);

    // this.scene.StageManager.MoveArea.hide(this);

    // this.areaMap = this.scene.StageManager.MoveArea.getAreaMap(pointerTileX,pointerTileY,this);
    // this.scene.StageManager.MoveArea.show(this);

    // this.scene.PlayerManager.player1ChessGroup.children.entries.forEach(
    //   (sprite) => {
    //     sprite.selectedChessMarker.setVisible(false);
    //   }
    // );
    
    // this.scene.PlayerManager.player1ChessGroup.children.entries.forEach(
    //   (sprite) => {
    //     sprite.selectedChessMarker.setVisible(false);
    //   }
    // );
    // this.selectedChessMarker.x = this.x - this.width/2;
    // this.selectedChessMarker.y = this.y - this.height/2;
    // this.selectedChessMarker.setVisible(true);  
  }

}
