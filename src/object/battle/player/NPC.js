import * as Search     from './npc/stageSearch';

export default class NPC{
  constructor(config) {
    this.scene = config.scene;
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

    
    if(mode === "ATTACK"){

      /*すぐ攻撃*/
      if(selectedChess.useTurn === 0){
        chess.attack(attackTarget);
        _this.turnFin();
      }
      /*移動あり*/
      if(selectedChess.useTurn === 1){
        let beforeIntPos = this.scene.GameManager.getIntPos({x:chess.x,y:chess.y});
        let worldPos = this.scene.GameManager.getWorldPos(tilePos);
        let queMove = setTimeout(function(){
          chess.move(worldPos,tilePos);
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
          chess.attack(attackTarget);
          _this.turnFin();
          clearTimeout(queAttack);
        }, 1500);        
      }      
    }
    
    if(mode === "MOVE"){
      let beforeIntPos = this.scene.GameManager.getIntPos({x:chess.x,y:chess.y});

      let worldPos = this.scene.GameManager.getWorldPos(tilePos);
      chess.move(worldPos,tilePos);
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
    // let itemList;
    // let itemGroup1 = this.scene.GameManager.playerItemGroup1.children.entries;

    let itemGroup2 = this.scene.GameManager.playerItemGroup2.children.entries;
    let playerChessGroup2 = this.scene.GameManager.playerChessGroup2.children.entries;
    let randomChessIndex =  Math.floor( Math.random() * (playerChessGroup2.length - 1 + 1) ) + 0;
    let selectedChess = playerChessGroup2[randomChessIndex];
    let chessPos = selectedChess.tilePos;


    if(itemGroup2.length > 0){

      let randomIndex =  Math.floor( Math.random() * (itemGroup2.length - 1 + 1) ) + 0;
      let selectedItem = itemGroup2[randomIndex];
      if(selectedItem.setted === true){
        return;
      }
      /*アイテムマップの更新*/
      this.scene.itemMap2[chessPos.Y][chessPos.X] = randomIndex;


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