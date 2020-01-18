import Character from './Character';


export default class Monster extends Character {

  constructor(config) {

    super(config);

    this.type = config.type === "enemy" ? config.type : "";

    this.typeTxt;
    if(this.type === "enemy"){
      this.typeTxt = this.scene.add.text(
        this.x + this.width - 10,
        this.y + this.height - 10,
        'E',
        { font: '10px Courier', fill: '#FFFFFF' }
      ); 
      this.typeTxt.depth = 11;     
    }

    

    this.depth = 10;

    this.setInteractive();

    this.x +=  this.width/2;
    this.y +=  this.height/2;
    
    this.beforePosition = {
      x: this.x,
      y: this.y
    };
    // this.setStage = false;
    /*==============================
    モンスターの移動エリアの表示
    ==============================*/    
    this.moveAreaMap = 
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,1,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,1,2,1,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];

    /*==============================
    モンスターの移動エリアの表示（コンテナー設定）
    ==============================*/       
    this.moveAreaCourser = this.scene.add.container();
    this.moveAreaCourser.depth = 5;

    for(var i = 0; i < this.moveAreaMap.length; i++){
      for(var k = 0; k < this.moveAreaMap[i].length; k++){

        if(this.moveAreaMap[i][k] === 1 || this.moveAreaMap[i][k] === 2){
          let move_area = this.scene.add.sprite(
            k * this.scene.map.tileWidth + this.scene.map.tileWidth/2,
            i * this.scene.map.tileHeight + this.scene.map.tileHeight/2,
            'move_area'
          );
          move_area.depth = 5;
          move_area.alpha = 0.4;

          move_area.setInteractive();

          move_area.on('pointerdown', function (pointer) {            
            /*==============================
            #TODO
            ・モンスター選択後に範囲を動かさない。
            ・移動決定ボタンの表示。
            ・タップした位置に敵がいたら攻撃のモーダル表示。
            ==============================*/

            if(this.scene.mode === "SET_MONSTER"){

            }else{
              let titlePosition = this.scene.getTilePosition();
              this.alpha = 1;
              this.x = titlePosition.x + this.width/2;
              this.y = titlePosition.y + this.height/2;
              this.isPick = false;  
              // this.setMoveArea();
              this.scene.conformMordal.modelOpen(this);

              if(this.y < this.scene.game.config.height/2){
                //画面半分より上にあるとき　
                console.log("画面半分より上にあるとき")
                this.scene.conformMordal.container.y = this.scene.game.config.height - 80;
              }else{
                //画面半分より下にあるとき　
                console.log("画面半分より下にあるとき")
                this.scene.conformMordal.container.y = 20;
              }

            };

          },this);
          this.moveAreaCourser.add(move_area);
  
        }
    
      }
    }
    this.moveAreaCourser.setVisible(false);
    this.moveAreaCourser.setActive(false);

    /*==============================
    モンスターの移動の操作
    ==============================*/      
    this.isPick = false;

    this.on('pointerdown', function (pointer) {

      if(this.scene.mode === "SET_MONSTER"){
        this.pickMonster(this);
      }else{
        this.setResetAll();
        this.setMoveArea();
      }
      this.isPick = true;  
    },this);
  }
  setMoveArea(){
    this.moveAreaCourser.setVisible(true);
    this.moveAreaCourser.setActive(true);
    this.moveAreaCourser.width = this.moveAreaMap[0].length * this.scene.map.tileWidth;
    this.moveAreaCourser.height = this.moveAreaMap.length * this.scene.map.tileHeight;
    this.moveAreaCourser.x = this.x - this.moveAreaCourser.width/2;
    this.moveAreaCourser.y = this.y - this.moveAreaCourser.height/2 + this.height/2;
  }
  removeMoveArea(){
    this.moveAreaCourser.setVisible(false);
    this.moveAreaCourser.setActive(false);    
  }
  seveBeforePostion(x,y){
    this.beforePosition.x = x;
    this.beforePosition.y = y;
  }
  setBeforePostion(){
    this.x = this.beforePosition.x;
    this.y = this.beforePosition.y;    
  }
  setResetAll(){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.removeMoveArea();
        monster.isPick = false;
        monster.x = monster.beforePosition.x;
        monster.y = monster.beforePosition.y;   
        // sprite.update(time, delta);
      }
    );  
  }
  setIcon(){
    if(this.type === "enemy"){
      this.typeTxt.x = this.x + 10;    
      this.typeTxt.y = this.y + 10;    
    }
  }
  pickMonster(object){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.alpha = 0.5;
        monster.isPick = false;
        // monster.removeMoveArea();
        // monster.isPick = false;
        // monster.x = monster.beforePosition.x;
        // monster.y = monster.beforePosition.y;   
        // sprite.update(time, delta);
      }
    ); 
    object.alpha = 1; 
    object.isPick = true;
  }
  resetPickMonster(){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.alpha = 1;
        monster.isPick = false;
      }
    );    
  }
}