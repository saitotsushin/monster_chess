export default class LayoutMonsters extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {
    super(config.scene);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    /*==============================
    モンスターの移動エリアの表示（コンテナー設定）
    ==============================*/       
    this.moveArea = this.scene.add.container();
    this.moveArea.depth = 5;

 
    this.MARGIN_BOTTOM = 160;  

    this.modelText = {
      next: {
        text: "次へ",
        yes: "スタート",
        no: "再配置"
      } 
    };

    this.battleStart = false;

    this.setLayerAreaY = 0; 

  }
  start(layer){

    console.log("star")

    this.scene.mode = "SET_MONSTER";

    let layerHeight = layer.height;
    
    let gameHeight = this.scene.game.config.height;
    let layerAreaHeight = gameHeight - this.MARGIN_BOTTOM;
    this.setLayerAreaY = layerAreaHeight - layerHeight;
    layer.y += this.setLayerAreaY;
    
    this.scene.conformMordal.setTarget(this);
    this.displayLayoutArea(layer);
    this.setChooseMonsers();
  }
  end(){
    this.scene.mode = "";
  }
  displayLayoutArea(layer){

    let stageSetColSize = 6;
    let stageSetRowSize = 3;

    let layerY = layer.y;
    let layerBottomY = layerY + layer.height;
    let moveAreaX = layer.x;
    let moveAreaY = layerBottomY - (stageSetRowSize * this.scene.map.tileHeight);


    for(var i = 0; i < stageSetRowSize; i++){
      for(var k = 0; k < stageSetColSize; k++){

        // if(this.moveAreaMap[i][k] === 1 || this.moveAreaMap[i][k] === 2){
          let move_area = this.scene.add.sprite(
            k * this.scene.map.tileWidth + this.scene.map.tileWidth/2,
            i * this.scene.map.tileHeight + this.scene.map.tileHeight/2,
            'move_area'
          );
          move_area.depth = 5;
          move_area.alpha = 0.4;

          move_area.setInteractive();

          move_area.on('pointerdown', function (pointer) {            
            let titlePosition = this.scene.getTilePosition();
            this.alpha = 1;
            let setPosition = {
              x: titlePosition.x + this.width/2,
              y: titlePosition.y + this.height/2
            }
            // this.isPick = false;  
            this.setStageToMonster(setPosition);
            this.checkSetFin();
            // let pickMonster = this.getMonster();
            

          },this);
          this.moveArea.add(move_area);
  
        // }
    
      }
    }
    this.moveArea.x = moveAreaX;
    this.moveArea.y = moveAreaY;
  }
  setChooseMonsers(){
    let margin_top = 20;
    let margin_left = 20;
    let padding_left = 5;
    this.scene.monsterGroup.children.entries.forEach(
      (monster,index) => {
        monster.x = index * (monster.width + padding_left) + margin_left;
        monster.y = margin_top;
        /*移動前の位置を保存しておく*/
        monster.seveBeforePostion(monster.x,monster.y);

      }
    );    
  }
  setStageToMonster(setPosition){
    let target = this.getMonster(); 
    if(!target){
      return;
    }
    target.x = setPosition.x; 
    target.y = setPosition.y; 
  }
  getMonster(){
    let target;
    this.scene.monsterGroup.children.entries.forEach(
      (monster,index) => {
        if(monster.isPick){
          target = monster;
        }
      }
    ); 
    return target;
  }

  setModalYes(){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.alpha = 1;
        monster.y -= this.setLayerAreaY;
        monster.beforePosition.x = monster.x;
        monster.beforePosition.y = monster.y;
      }
    );
    this.scene.conformMordal.target = this.scene.conformMordal;
    this.scene.conformMordal.resetModalText();
    this.scene.mode = "";
    this.moveArea.setVisible(false);
    this.setVisible(false);
    this.scene.stageLayer.y -= this.setLayerAreaY;
    this.scene.enemyGroup.children.entries.forEach(
      (monster) => {
        monster.setVisible(true);
        monster.typeTxt.setVisible(true);
      }
    );

  }
  setModalNo(){
  }
  pickMonster(object){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.alpha = 0.5;
        monster.isPick = false;
      }
    ); 
    object.alpha = 1; 
    object.isPick = true;
  }
  checkSetFin(){
    let count = 0;
    let retY = this.moveArea.y;
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        if(monster.y >= retY){
          count++;
        }
        // monster.y -= this.setLayerAreaY;
      }
    ); 
    if(count === 5){
      this.scene.conformMordal.mordalText.setText(this.modelText.next.text);
      this.scene.conformMordal.btn_yes.setText(this.modelText.next.yes);
      this.scene.conformMordal.btn_no.setText(this.modelText.next.no);
      this.scene.conformMordal.modelOpen();
      this.scene.conformMordal.container.y = this.scene.game.config.height - 80;
    }
  }
}
  