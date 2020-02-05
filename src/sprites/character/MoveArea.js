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
    this.moveAlpha = 0.4;
    this.attackAlpha = 0.6;
    this.setArea(
      this.moveAreaGroup,
      this.moveAreaMapBase,
      this.moveAlpha      
    );
    this.attackAreaGroup = this.scene.add.group();
    this.setArea(
      this.attackAreaGroup,
      this.attackAreaMapBase,
      this.attackAlpha
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
  setPostion(X,Y){

    /*初期化*/
    for(var i = 0; i < this.target.moveAreaArr.length; i++){
      for(var k = 0; k < this.target.moveAreaArr[i].length; k++){
        this.target.moveAreaArr[i][k] = 0;
      }
    }
    for(var i = 0; i < this.target.attackAreaArr.length; i++){
      for(var k = 0; k < this.target.attackAreaArr[i].length; k++){
        this.target.attackAreaArr[i][k] = 0;
      }
    }
    
    //
    this.setPostionGroup(
      X,
      Y,
      this.moveAreaGroup,
      this.target.moveAreaMapBase,
      this.target.moveAreaArr,
      this.moveAlpha
    )
    this.setPostionGroup(
      X,
      Y,
      this.attackAreaGroup,
      this.target.attackAreaMapBase,
      this.target.attackAreaArr,
      this.attackAlpha
    )

  }
  setPostionGroup(X,Y,group,base,area,alpha){
    let harfHeight = (base.length - 1) / 2;
    let harfWidth = (base[0].length - 1) / 2;
    let baseY = harfHeight - Y;
    let baseX = harfWidth - X;
    let count = 0;
    let i2 = 0;
    let k2 = 0;
    //透明度の初期化
    group.children.entries.forEach(
      (area,index) => {
        area.alpha = 0;
      }
    ); 
    for(var i = baseY; i < harfHeight + baseY; i++){//縦（y）
      for(var k = baseX; k < harfWidth + baseX; k++){//横（x）
        if(base[i][k] === 1){
          area[i2][k2] = 1;
          let pos = this.scene.stageManager.getPositionNumber(k2,i2);
          group.children.entries[count].x = pos.x;
          group.children.entries[count].y = pos.y;
          group.children.entries[count].alpha = alpha;
          count++;
        }
        k2++;
      }
      k2 = 0;
      i2++;
    }
  }
  showAll(){
    this.moveAreaGroup.children.entries.forEach(
      (moveArea) => {
        moveArea.setVisible(true);        
      }
    );  
    this.attackAreaGroup.children.entries.forEach(
      (moveArea) => {        
        moveArea.setVisible(true);
      }
    );  
  }
  hideAll(){
    this.moveAreaGroup.children.entries.forEach(
      (moveArea) => {
        moveArea.setVisible(false);        
      }
    );  
    this.attackAreaGroup.children.entries.forEach(
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
