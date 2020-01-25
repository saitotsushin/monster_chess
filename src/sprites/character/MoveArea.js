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

    this.positionInt = {
      x: 0,
      y: 0
    }


    /*==============================
    モンスターの移動エリアの表示（コンテナー設定）
    ==============================*/ 
    this.moveAreaGroup = this.scene.add.group();
    this.setArea(
      this.moveAreaGroup,
      this.moveAreaMapBase,
      0.4      
    );
    this.attackAreaGroup = this.scene.add.group();
    this.setArea(
      this.attackAreaGroup,
      this.attackAreaMapBase,
      0.6
    );

  }

  setArea(group,map,alpha){
    for(var i = 0; i < map.length; i++){
      for(var k = 0; k < map[i].length; k++){

        if(map[i][k] === 1 || map[i][k] === 2){
          let area = this.scene.add.sprite(
            k * this.scene.map.tileWidth + this.scene.stageLayer.x + this.scene.map.tileWidth/2,
            i * this.scene.map.tileHeight + this.scene.stageLayer.y + this.scene.map.tileWidth/2,
            'move_area'
          );
          area.alpha = alpha;
          area.positionInt = {
            x: k,
            y: i
          };

          group.add(area);

        }        
      }

    }
    group.width = map[0].length * this.scene.map.tileWidth;
    group.height = map.length * this.scene.map.tileHeight;

    this.hide(group);
  }
  
  initSetPosition(monster){

    let moveArr = monster.moveAreaArr;
    let attackArr = monster.attackAreaArr;
    let moveAreaGroup = this.moveAreaGroup;
    let attackAreaGroup = this.attackAreaGroup;
    let attackAreaMapBase = monster.attackAreaMapBase;
    let moveAreaMapBase = monster.moveAreaMapBase;

    /*==================
    初期化
    ====================*/
    for(var i = 0; i < moveArr.length; i++){
      for(var k = 0; k < moveArr[i].length; k++){
        moveArr[i][k] = 0;
      }
    }
    for(var i = 0; i < attackArr.length; i++){
      for(var k = 0; k < attackArr[i].length; k++){
        attackArr[i][k] = 0;
      }
    }
    /*==================
    配置
    ====================*/
    let setting = {
      group: moveAreaGroup,
      arr: moveArr,
      arrBase: moveAreaMapBase,
      monster:monster
    };
    this.setMovePosition(setting);
    setting = {
      group: attackAreaGroup,
      arr: attackArr,
      arrBase: attackAreaMapBase,
      monster:monster
    }
    this.setMovePosition(setting);
  }
  setMovePosition(setting){
    let group = setting.group;
    let arr = setting.arr;
    let arrBase = setting.arrBase;
    let monster = setting.monster;
    let count = 0;
    let movePostion;
    let postion;

    for(var i = 0; i < arrBase.length; i++){//縦の数（y）
      for(var k = 0; k < arrBase[i].length; k++){//横の数（x）
        if(arrBase[i][k] !== 0){
          group.children.entries[count].x = monster.x - group.width/2 + k*monster.width + monster.width/2;
          group.children.entries[count].y = monster.y - group.height/2 + i*monster.width + monster.width/2;
          movePostion = {
            x: group.children.entries[count].x,
            y: group.children.entries[count].y
          }
          postion = this.getPostion(movePostion);
          if(postion.x >= 0 && postion.y >=0){
            arr[postion.y][postion.x] = 1;
          }
          if(arrBase[i][k] === 2){
            arr[postion.y][postion.x] = 2;
          }
          count++;
        }
      }
    }
  }
  getPostion(pos){
    let setPos = {
      x: pos.x,
      y: pos.y
    }
    setPos.x = (pos.x - this.scene.stageLayer.x - this.scene.map.tileWidth*0.5) / this.scene.map.tileWidth;
    setPos.y = (pos.y - this.scene.stageLayer.y - this.scene.map.tileWidth*0.5) / this.scene.map.tileWidth;
    return setPos;
  }
  show(monster){
    this.scene.setMoveAreaResetAll();
    this.moveAreaGroup.children.entries.forEach(
      (moveArea) => {
        
        if(moveArea.x === monster.x && moveArea.y === monster.y){
          moveArea.setVisible(false);
        }else{
          moveArea.setVisible(true);
        }
      }
    );  
    this.attackAreaGroup.children.entries.forEach(
      (moveArea) => {
        
        if(moveArea.x === monster.x && moveArea.y === monster.y){
          moveArea.setVisible(false);
        }else{
          moveArea.setVisible(true);
        }
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
