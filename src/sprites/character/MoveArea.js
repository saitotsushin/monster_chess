export default class MoveArea extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    console.log("MoveArea");
    /*==============================
    敵だった場合の設定
    ==============================*/       
    if(this.type === "enemy"){
      this.typeTxt = this.scene.add.text(
        this.x + this.width - 10,
        this.y + this.height - 10,
        'E',
        { font: '10px Courier', fill: '#FFFFFF' }
      ); 
      this.typeTxt.depth = 11;
      this.moveAreaMap.reverse();
    }

    /*==============================
    モンスターの移動エリアの表示（コンテナー設定）
    ==============================*/ 
    this.moveAreaGroup = this.scene.add.group();
    this.moveAreaGroup.depth = 5;


    for(var i = 0; i < this.moveAreaMap.length; i++){
      for(var k = 0; k < this.moveAreaMap[i].length; k++){

        if(this.moveAreaMap[i][k] === 1 || this.moveAreaMap[i][k] === 2){
          let move_area = this.scene.add.sprite(
            k * this.scene.map.tileWidth + this.scene.map.tileWidth/2,
            i * this.scene.map.tileHeight,
            'move_area'
          );
          move_area.depth = 10;
          move_area.alpha = 0.4;

          move_area.setInteractive();

          move_area.on('pointerdown', function (pointer) {            

            let enemyCheck = false;
            let enemy;

            if(this.scene.mode === "SET_MONSTER"){

            }else{
              let titlePosition = this.scene.getTilePosition();
              this.alpha = 1;
              this.scene.enemyGroup.children.entries.forEach(
                (monster,index) => {
                  if(monster.x === titlePosition.x + this.width/2
                    && monster.y === titlePosition.y + this.height/2)
                  {
                    enemyCheck = true;
                    enemy = monster;
                  }
                }
              );


              if(enemyCheck){
                this.setModalTextAttacking();
                this.setBeforePostion();
              }else{
                this.setModalTextMoving();
                this.x = titlePosition.x + this.width/2;
                this.y = titlePosition.y + this.height/2;  
              }

              this.isPick = false;

              if(
                titlePosition.x + this.scene.map.tileWidth/2 === this.beforePosition.x
                && titlePosition.y + this.scene.map.tileHeight/2 === this.beforePosition.y
              ){
                this.scene.conformMordal.modelClose();
              }else{
                this.scene.conformMordal.modelOpen(this);
              }

              if(this.y < this.scene.game.config.height/2){
                //画面半分より上にあるとき　
                console.log("画面半分より上にあるとき")
                this.scene.conformMordal.container.y = this.scene.game.config.height - 80;

              }else{
                //画面半分より下にあるとき　
                console.log("画面半分より下にあるとき")
                this.scene.conformMordal.container.y = 20;
              }
              console.log("ax="+this.x+"/ay="+this.y)

            };

          },this);
          this.moveAreaGroup.add(move_area);
  
        }        
      }
      this.moveAreaGroup.width = this.moveAreaMap[0].length * this.scene.map.tileWidth;
      this.moveAreaGroup.height = this.moveAreaMap.length * this.scene.map.tileHeight;

    }
    this.hideMoveArea();
  }
  setMoveArea(){
    this.setResetAll();
    /*
    TODO
    再配置
    */
    let moveAreaGroup = this.moveAreaGroup;
    let _this = this;
    this.moveAreaGroup.children.entries.forEach(
      (moveArea) => {
        moveArea.x = moveArea.x + _this.x - moveAreaGroup.width/2;
        moveArea.y = moveArea.y + _this.y - moveAreaGroup.height/2 + moveArea.width/2;
        if(_this.type === "enemy"){
          
        }else{
          _this.scene.monsterGroup.children.entries.forEach(
            (monster) => {
              if(monster.x === moveArea.x && monster.y === moveArea.y){
                moveArea.setVisible(false);
              }else{
                moveArea.setVisible(true);
              }
            }
          );  
        }
      }
    );  

  }
  hideMoveArea(){
    this.moveAreaGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
        sprite.setActive(false);
      }
    );  
  }

}
