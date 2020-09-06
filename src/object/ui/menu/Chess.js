export default class Chess extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key,config.frame);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.scene = config.scene;

    this.setInteractive();

    this.moveAreaMapBase = [];
    this.attackAreaMapBase = [];
    this.areaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,9,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ];    
    this.areaMap = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],      
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]      
    ];
    this.areaMoveMap = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],      
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]      
    ];    
    this.areaAttackMap = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],      
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]      
    ];    
    this.badge = this.scene.add.sprite(
      0,
      0,
      'spritesheet',
      'badge'
    );
    this.badge.depth = 13;
    

    this.chessStatus = this.scene.add.sprite(
      0,
      0,
      'spritesheet',
      'chess_status'
    );
    this.chessStatus.depth = 11;

    this.AT_text = this.scene.add.bitmapText(
      0,
      0,
      'bitmapFontWhite',
      0,
      10
    );
    this.AT_text.setLetterSpacing(-6);
    this.AT_text.depth = 12;

    this.HP_text = this.scene.add.bitmapText(
      0,
      0,
      'bitmapFontWhite',
      0,
      10
    ); 
    this.HP_text.setLetterSpacing(-6);
    this.HP_text.depth = 13;

    this.has_count_text = this.scene.add.bitmapText(
      0,
      0,
      'bitmapFontWhite',
      0,
      10
    ); 
    this.has_count_text.setLetterSpacing(0);
    this.has_count_text.depth = 13;

    this.tilePos = {
      X: 0,
      Y: 0
    }
    

    // this.setInteractive();
    // this.on('pointerdown', function (pointer) {
    //   // if(this.scene.MODE === "EDIT"){
    //     this.scene.touchChess(this);
    //   // }
    // });
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
  move(setting,mode){
    let _x = setting.x;
    let _y = setting.y;
    this.x = _x;
    this.y = _y;
    this.chessStatus.x = _x;
    this.chessStatus.y = _y;

    this.AT_text.x = _x - 11;
    this.AT_text.y = _y + 6;
    this.HP_text.x = _x + 2;
    this.HP_text.y = _y + 6;
    // if(mode !== "tile"){
      this.badge.x = _x + 12;
      this.badge.y = _y - 12;
      this.has_count_text.x = _x + 7;
      this.has_count_text.y = _y - 18;  
    // }

  }
  setStatus(setting){
    let _power = setting.power;
    let _hp = setting.hp;
    let _count = setting.count;
    this.AT_text.setText(_power);
    this.HP_text.setText(_hp);
    this.has_count_text.setText(_count);
  }
}
