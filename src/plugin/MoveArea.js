export default class MoveArea extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(
      config.scene,
      config.type
    )
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.x = 0;
    this.y = 0;

    this.target = config.target;
    this.positionInt = {
      x: 0,
      y: 0
    }
    this.area1Group = this.scene.add.group();
    this.area2Group = this.scene.add.group();
    this.area3Group = this.scene.add.group();
    this.createAreaPanel();
  }

  setArrPosition(X,Y,target,mode){

    let base = target.areaMapBase;
    let area = target.areaArr;
    let area2 = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    let harfHeight = (base.length - 1) / 2;
    let harfWidth = (base[0].length - 1) / 2;
    let baseY = harfHeight - Y;
    let baseX = harfWidth - X;
    let i2 = 0;
    let k2 = 0;

    /*初期化*/

    for(var i = baseY; i < harfHeight + baseY + 1; i++){//縦（y）
      for(var k = baseX; k < harfWidth + baseX + 1; k++){//横（x）
        if(base[i][k] !== 0 && base[i][k] !== 9){
          area2[i2][k2] = base[i][k];
        }
        k2++;
      }
      k2 = 0;
      i2++;
    }


    return area2;
    
  }
  createAreaPanel(){
    //1:移動      | move_area
    //2:攻撃      | attack_area
    //3:移動＋攻撃 | attack_move_area
    this.setAreaPanel(this.area1Group,"move_area");
    this.setAreaPanel(this.area2Group,"attack_area");
    this.setAreaPanel(this.area3Group,"attack_move_area");    
  }
  setAreaPanel(group,key){
    let area;
    let col = 6;
    let row = 8;
    for(var i = 0; i < row; i++){
      for(var k = 0; k < col; k++){
        area = this.scene.add.sprite(0,0,key);
        area.x = k * this.scene.map.tileWidth + this.scene.map.tileWidth/2 + this.scene.stageLayer.x;
        area.y = i * this.scene.map.tileHeight + this.scene.map.tileHeight/2 + this.scene.stageLayer.y;  
        area.setVisible(false);
        group.add(area);
      }
    }
  }
  show(target){
    //添え字（y*幅+x)
    for(var i = 0; i < target.areaArr.length; i++){//y
      for(var k = 0; k < target.areaArr[i].length; k++){//x
        if(target.areaArr[i][k] === 1){
          this.area1Group.children.entries[i*target.areaArr[i].length + k].setVisible(true);
        }
        if(target.areaArr[i][k] === 2){
          this.area2Group.children.entries[i*target.areaArr[i].length + k].setVisible(true);
        }
        if(target.areaArr[i][k] === 3){
          this.area3Group.children.entries[i*target.areaArr[i].length + k].setVisible(true);
        }
      }
    };
  }
  hide(target){
    this.area1Group.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    ); 
    this.area2Group.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );     
    this.area3Group.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );  
  }


}
