import * as Search     from './npc/stageSearch';

export default class NPC{
  constructor(config) {
    this.scene = config.scene;
    this.itemCount = 0;
    this.itemMaxCount = 3;
    // this.create();
  }
  // create(){

  // }
  myTurn(){
    let selectedChess = Search.thinkAI(this.scene);
    this.setItemByRandom();//トラップを置くか（移動前）
    this.actChess(selectedChess);
    this.setItemByRandom();//トラップを置くか（移動後）
  }
  turnFin(){
    this.scene.GameManager.UIManager.Turn.changeHead('player1');
    this.scene.turnChange();
  }
  /*==================
  敵のチェスの行動
  ==================*/
  actChess(selectedChess){
    let chess = selectedChess.chess;
    let attackTarget = selectedChess.attackTarget;

    
    let tilePos = selectedChess.tilePos;
    let mode = selectedChess.mode;
    let cursor = this.scene.GameManager.UIManager.Cursor;
    cursor.x = chess.x;
    cursor.y = chess.y;
    cursor.setVisible(true);

    let _this = this;

    let isItemFired = false;

    
    if(mode === "ATTACK"){

      /*すぐ攻撃*/
      if(selectedChess.useTurn === 0){
        /*アイテムのチェック*/
        isItemFired = this.scene.GameManager.checkStageItem(attackTarget.tilePos,chess,'ATTACKED');
        if(isItemFired){
          this.scene.itemMap[attackTarget.tilePos.Y][attackTarget.tilePos.X] = 0;
          this.scene.itemMap2[attackTarget.tilePos.Y][attackTarget.tilePos.X] = 0;    
        }else{
          chess.attack(attackTarget);
        }

        _this.turnFin();
      }
      /*移動あり*/
      if(selectedChess.useTurn === 1){
        let beforeIntPos = this.scene.GameManager.getIntPos({x:chess.x,y:chess.y});
        let worldPos = this.scene.GameManager.getWorldPos(tilePos);
        let queMove = setTimeout(function(){
          /*アイテムのチェック*/
          chess.move(worldPos,tilePos);
          _this.scene.GameManager.checkStageItem(tilePos,chess,'STEP_ON');
          cursor.x = chess.x;
          cursor.y = chess.y;          
          clearTimeout(queMove);
        }, 500); 
              
        /*チェスデータの更新*/
        let chessIndex = chess.groupIndex;
        this.scene.chessMapData2[beforeIntPos.Y][beforeIntPos.X] = 0;
        this.scene.chessMapData2[tilePos.Y][tilePos.X] = chessIndex;
        this.scene.GameManager.updateStage();
        let queSelect = setTimeout(function(){
          cursor.x = attackTarget.x;
          cursor.y = attackTarget.y;
          clearTimeout(queSelect);
        }, 1000);         
        let queAttack = setTimeout(function(){        
          /*アイテムのチェック*/
          isItemFired = _this.scene.GameManager.checkStageItem(attackTarget.tilePos,chess,'ATTACKED');
          if(isItemFired){
            this.scene.itemMap[attackTarget.tilePos.Y][attackTarget.tilePos.X] = 0;
            this.scene.itemMap2[attackTarget.tilePos.Y][attackTarget.tilePos.X] = 0;    
          }else{
            chess.attack(attackTarget);    
          }
          _this.turnFin();
          clearTimeout(queAttack);
        }, 1500);        
      }      
    }
    
    if(mode === "MOVE"){
      let beforeIntPos = this.scene.GameManager.getIntPos({x:chess.x,y:chess.y});

      let worldPos = this.scene.GameManager.getWorldPos(tilePos);
      chess.move(worldPos,tilePos);
      /*アイテムのチェック*/
      isItemFired = _this.scene.GameManager.checkStageItem(tilePos,chess,'STEP_ON');
      if(isItemFired){
        this.scene.itemMap[tilePos.Y][tilePos.X] = 0;
        this.scene.itemMap2[tilePos.Y][tilePos.X] = 0;
      }

      /*チェスデータの更新*/
      let chessIndex = chess.groupIndex;
      this.scene.chessMapData2[beforeIntPos.Y][beforeIntPos.X] = 0;
      this.scene.chessMapData2[tilePos.Y][tilePos.X] = chessIndex;
      this.scene.GameManager.updateStage();
      _this.turnFin();
    }
  }
  setItemByRandom(){
    /*配置するか */
    var random = Math.random();
    if(random < 0.4){
      //40%未満で実行する
    }else{
      // return;
    }

    let itemGroup2 = this.scene.GameManager.playerItemGroup2.children.entries;
    let playerChessGroup2 = this.scene.GameManager.playerChessGroup2.children.entries;
    let randomChessIndex =  Math.floor( Math.random() * (playerChessGroup2.length - 1 + 1) ) + 0;
    let selectedChess = playerChessGroup2[randomChessIndex];
    let chessPos = selectedChess.tilePos;

    /*==============
    デバッグ START
    ==============*/
    // this.scene.itemMap2 = [
    //   [0,0,0,0,0],
    //   [0,0,0,0,0],
    //   [0,1,2,3,0],
    //   [0,0,0,0,0],
    //   [0,0,0,0,0]
    // ];     
    // for(var i = 0; i < this.scene.itemMap2.length; i++){
    //   for(var k = 0; k < this.scene.itemMap2[i].length; k++){
    //     if(this.scene.itemMap2[i][k] !== 0){
    //       let groupIndex = this.scene.itemMap2[i][k] - 1;
    //       this.scene.GameManager.playerItemGroup2.children.entries.forEach(
    //         (sprite,index) => {
    //           if(sprite.groupIndex === groupIndex){
    //             //デバッグ用に表示
    //             sprite.x = k * 32 + 16;
    //             sprite.y = i * 32 + 40;
    //             sprite.setVisible(true);
    //             sprite.removeInteractive();    
    //           }
    //         }
    //       );          
    //     }
    //   }
    // }
    /*==============
    デバッグ END
    ==============*/

    if(this.itemMaxCount > this.itemCount){

      // let itemIndex =  this.itemCount;
      if(this.scene.itemMap2[chessPos.Y][chessPos.X] !== 0){
        //設置済みならスキップ
        return;
      }
      let selectedItem = itemGroup2[this.itemCount];
      this.itemCount++;
      /*アイテムマップの更新*/
      this.scene.itemMap2[chessPos.Y][chessPos.X] = selectedItem.groupIndex;

      //設定済みにする。
      selectedItem.setted = true;
      selectedItem.removeInteractive();

      //デバッグ用に表示
      selectedItem.x = selectedChess.x;
      selectedItem.y = selectedChess.y;
      selectedItem.setVisible(true)
    }else{
      return;
    }

  }  
}