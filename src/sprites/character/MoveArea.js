export default class MoveArea extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(
      config.scene,
      config.type,
      config.target
    )
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.x = 0;
    this.y = 0;

    this.target = config.target;
    this.moveAreaMapBase = config.target.moveAreaMapBase;
    this.attackAreaMapBase = config.target.attackAreaMapBase;
    this.areaMapBase = config.target.areaMapBase;

    this.positionInt = {
      x: 0,
      y: 0
    }


    /*==============================
    モンスターの移動エリアの表示（コンテナー設定）
    ==============================*/ 
    this.areaGroup = this.scene.add.group();
    this.setArea(
      this.areaGroup,
      this.areaMapBase 
    );
    if(this.target.type === "player2"){
      this.areaGroup.children.entries.reverse();
    }
    // this.resetAreaArr = [
    //   [0,0,0,0,0,0],
    //   [0,0,0,0,0,0],      
    //   [0,0,0,0,0,0],
    //   [0,0,0,0,0,0],
    //   [0,0,0,0,0,0],
    //   [0,0,0,0,0,0],
    //   [0,0,0,0,0,0],
    //   [0,0,0,0,0,0]      
    // ];

  }



  setArea(group,map){
    let key = "";
    for(var i = 0; i < map.length; i++){
      for(var k = 0; k < map[i].length; k++){
        //1:移動
        //2:攻撃
        //3:移動＋攻撃
        if(map[i][k] === 1){
          key = "move_area";
        }
        if(map[i][k] === 2){
          key = "attack_area";
        }
        if(map[i][k] === 3){
          key = "attack_move_area";
        }
        if(key !== ""){
          let area = this.scene.add.sprite(
            k * this.scene.map.tileWidth + this.scene.stageLayer.x + this.scene.map.tileWidth/2,
            i * this.scene.map.tileHeight + this.scene.stageLayer.y + this.scene.map.tileWidth/2,
            key
          );
          area.positionInt = {
            x: k,
            y: i
          };

          group.add(area);

          key = "";//リセット
        }

      }

    }
    group.width = map[0].length * this.scene.map.tileWidth;
    group.height = map.length * this.scene.map.tileHeight;

    this.hide(group);
  }
  setPostion(X,Y){


    /*初期化*/
    for(var i = 0; i < this.target.areaArr.length; i++){
      for(var k = 0; k < this.target.areaArr[i].length; k++){
        this.target.areaArr[i][k] = 0;
      }
    }


    this.setPostionGroup(
      X,
      Y,
      this.areaGroup,
      this.target.areaMapBase,
      this.target.areaArr
    );

    
  }
  setPostionGroup(X,Y,group,base,area,mode){


    let _mode = mode ? mode : ""

    let harfHeight = (base.length - 1) / 2;
    let harfWidth = (base[0].length - 1) / 2;
    let baseY = harfHeight - Y;
    let baseX = harfWidth - X;
    let count = 0;
    let i2 = 0;
    let k2 = 0;

    for(var i = baseY; i < harfHeight + baseY; i++){//縦（y）
      for(var k = baseX; k < harfWidth + baseX; k++){//横（x）
        if(base[i][k] !== 0 && base[i][k] !== 9){
          area[i2][k2] = base[i][k];
          if(_mode !== "shift"){
            let pos = this.scene.stageManager.getPositionNumber(k2,i2);
            group.children.entries[count].x = pos.x;
            group.children.entries[count].y = pos.y;
            count++;  
          }
        }
        k2++;
      }
      k2 = 0;
      i2++;
    }
  }
  showAll(){
    this.areaGroup.children.entries.forEach(
      (moveArea) => {
        moveArea.setVisible(true);        
      }
    );
  }
  hideAll(){
    this.areaGroup.children.entries.forEach(
      (moveArea) => {
        moveArea.setVisible(false);        
      }
    ); 
  }
  show(group){
    group.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
        sprite.setActive(true);
      }
    );  
  }
  hide(group){
    group.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
        sprite.setActive(false);
      }
    );  
  }


}
