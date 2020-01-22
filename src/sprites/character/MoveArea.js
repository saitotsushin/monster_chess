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
    敵だった場合の設定
    ==============================*/       
    if(config.type === "enemy"){
      this.typeTxt = this.scene.add.text(
        config.target.x + config.target.width/2 - 10,
        config.target.y + config.target.height/2 - 10,
        'E',
        { font: '10px Courier', fill: '#FFFFFF' }
      ); 
      this.typeTxt.depth = 11;
      this.moveAreaMapBase.reverse();
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
    let stageLayer = this.scene.stageLayer;
    let _this = this;
    let postion;
    let movePostion;

    function loop(group,arr,monster){
      group.children.entries.forEach(
        (area,index) => {
          area.x = monster.x + area.x - group.width/2 - stageLayer.x;
          area.y = monster.y + area.y - group.height/2 - stageLayer.y;
          if(area.x === monster.x && area.y === monster.y){
            area.setVisible(false);
          }
          movePostion = {
            x: area.x,
            y: area.y
          }
          postion = _this.getPostion(movePostion);
  
          arr[postion.y][postion.x] = 1;
        }
      );
    }
    loop(moveAreaGroup,moveArr,monster);
    loop(attackAreaGroup,attackArr,monster);
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
