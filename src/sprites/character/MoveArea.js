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

    for(var i = 0; i < this.moveAreaMapBase.length; i++){
      for(var k = 0; k < this.moveAreaMapBase[i].length; k++){

        if(this.moveAreaMapBase[i][k] === 1 || this.moveAreaMapBase[i][k] === 2){
          let move_area = this.scene.add.sprite(
            k * this.scene.map.tileWidth + this.scene.stageLayer.x + this.scene.map.tileWidth/2,
            i * this.scene.map.tileHeight + this.scene.stageLayer.y + this.scene.map.tileWidth/2,
            'move_area'
          );
          move_area.alpha = 0.4;
          move_area.positionInt = {
            x: k,
            y: i
          };

          this.moveAreaGroup.add(move_area);

        }        
      }

    }
    this.width = this.moveAreaMapBase[0].length * this.scene.map.tileWidth;
    this.height = this.moveAreaMapBase.length * this.scene.map.tileHeight;

    this.hide();
  }
  
  initSetPosition(monster){
    let moveAreaGroup = this.moveAreaGroup;

    this.moveAreaGroup.children.entries.forEach(
      (moveArea,index) => {
        moveArea.x = monster.x + moveArea.x - this.width/2 - this.scene.stageLayer.x;
        moveArea.y = monster.y + moveArea.y - this.height/2 - this.scene.stageLayer.y;
        if(moveArea.x === monster.x && moveArea.y === monster.y){
          moveArea.setVisible(false);
        }
        let movePostion = {
          x: moveArea.x,
          y: moveArea.y
        }
        let postion = this.getPostion(movePostion);

        monster.moveAreaArr[postion.y][postion.x] = 1;
      },this
    );  

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
    this.setResetAll();
    this.moveAreaGroup.children.entries.forEach(
      (moveArea) => {
        
        if(moveArea.x === monster.x && moveArea.y === monster.y){
          moveArea.setVisible(false);
        }else{
          moveArea.setVisible(true);
        }

      }
    );  

  }
  hide(){
    this.moveAreaGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
        sprite.setActive(false);
      }
    );  
  }
  setResetAll(){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.MoveArea.hide();
        monster.isPick = false;
      }
    );
  }

}
