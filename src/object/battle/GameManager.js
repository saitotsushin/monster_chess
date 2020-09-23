import UIManager    from './UIManager';
import StageManager from './StageManager';
import Layout       from './stage/Layout';
import NPC          from './player/NPC';

export default class GameManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;
    // this.playerChessGroup = this.scene.add.group();
    this.stageMapAll = [];

    this.playerChessGroup;
    this.playerChessGroup2;
    this.playerItemGroup;
    this.playerItemGroup2;

    this.selectedChess;
    this.attackedChess;

    this.beforePos = {
      X: 0,
      Y: 0
    };
    this.STATUS = {
      MODE   : "",
      MOVE   : "",
      ATTACK : ""
    };
    
  
    this.create();
  }
  create(){
    this.StageManager = new StageManager({
      scene: this.scene
    });
    this.UIManager = new UIManager({
      scene: this.scene
    });

    this.Layout = new Layout({
      scene: this.scene
    });

    
    this.NPC = new NPC({
      scene: this.scene
    });
  }
  /*==============================
  初期化
  ------------------------------*/
  initScene(setting){
    this.STATUS.MODE = "";
    this.STATUS.MOVE = "";
    this.STATUS.ATTACK = "";
    this.UIManager.initScene();
    this.StageManager.initScene({
      map: setting.map,
      chessDataMaster: setting.chessDataMaster,
      chessMapData: setting.chessMapData
    });

    /*相手のチェスを生成*/
    this.playerChessGroup2 = this.scene.add.group();

    let _this = this;
    // console.log(" _this.registry.list.floorNumber", _this.registry.list.floorNumber)
    var matchData = this.scene.LoadGameData.chessData2.filter(function(item, index){
      if (item.name == _this.scene.registry.list.floorNumber) return true;
    });
    console.log("matchData",matchData)
    let chessData2 = matchData[0].chessGroup;     


    let setting2 = {
      addGroup: this.playerChessGroup2,//追加するグループ
      chessData: chessData2,//チェスデータ
      // chessData: this.scene.registry.list.chessData2,//チェスデータ
      chessMapData: this.scene.chessMapData2,//レイアウトデータ
      playerType: 'player2'
    };
    this.StageManager.createEnemyGroup(setting2);
    this.StageManager.setKingToChessCPU(this.playerChessGroup2,this.scene.chessMapData2);

    /*トラップを生成*/
    this.playerItemGroup = this.scene.add.group();
    
    let setting_item = {
      addGroup: this.playerItemGroup,//追加するグループ
      itemData: this.scene.registry.list.itemData,//チェスデータ
      playerType: 'player1'
    }

    this.UIManager.createItemGroup(setting_item);

    this.playerItemGroup2 = this.scene.add.group();

    let setting_item2 = {
      addGroup: this.playerItemGroup2,//追加するグループ
      itemData: this.scene.registry.list.itemData2,//チェスデータ
      playerType: 'player2'
    }    
    this.UIManager.createItemGroup(setting_item2);


    /*ステージ配置用のトラップタイルを生成*/
    this.UIManager.createItemStage();
    this.Layout.initScene();

  }
  /*==============================
  レイアウト完了
  ------------------------------*/      
  layoutFin(){
    this.UIManager.menuItemShow();

    /*自分のチェスを生成*/
    this.playerChessGroup = this.scene.add.group();
    let setting = {
      addGroup: this.playerChessGroup,//追加するグループ
      chessData: this.scene.registry.list.chessData,//チェスデータ
      chessMapData: this.scene.chessMapData,//レイアウトデータ
      playerType: 'player1'
    }
    this.StageManager.createChessGroup(setting);
    this.UIManager.menuItemShow();

    this.Layout.hideAll();

    /*相手のチェスがNPCだったらアイテム設置*/
    this.NPC.setItemByRandom();

    /*チェスグループの表示*/
    this.StageManager.showChessGroup(this.playerChessGroup,'player1');
    this.StageManager.showChessGroup(this.playerChessGroup2,'player2');

    this.scene.startGame();
  }
  /*==============================
  ゲームスタート
  ------------------------------*/      
  startGame(){
    /*プレイヤー２のレイアウト設定*/

    this.updateStage();
    this.UIManager.startGame();
  } 
  /*==============================
  ターンチェンジ
  ------------------------------*/    
  turnChange(){
    this.STATUS.MOVE = "";
    this.STATUS.ATTACK = "";
  }
  /*==============================
  チェスの削除
  ------------------------------*/    
  removeChess(chess){
    let playerType = chess.playerType;
    let posInt = {
      X: chess.tilePos.X,
      Y: chess.tilePos.Y
    }
    chess.icon_enemy.destroy();
    chess.chessStatus.destroy();
    chess.AT_text.destroy();
    chess.HP_text.destroy();
    chess.damageText.destroy();
    chess.destroy();
    chess.icon_levelup.destroy();
    // chess.setVisible(false);
    
    this.scene.STATUS.PLAYER1.CHESS_COUNT = 0;
    this.scene.STATUS.PLAYER2.CHESS_COUNT = 0;

    if(playerType === "player1"){
      this.scene.chessMapData[posInt.Y][posInt.X] = 0;
    }
    for(var i = 0; i < this.scene.chessMapData.length; i++){
      for(var k = 0; k < this.scene.chessMapData[i].length; k++){
        if(this.scene.chessMapData[i][k] !== 0){
          this.scene.STATUS.PLAYER1.CHESS_COUNT++;
        }
      }
    }

    if(playerType === "player2"){
      this.scene.chessMapData2[posInt.Y][posInt.X] = 0;
    }
    for(var i = 0; i < this.scene.chessMapData2.length; i++){
      for(var k = 0; k < this.scene.chessMapData2[i].length; k++){
        if(this.scene.chessMapData2[i][k] !== 0){
          this.scene.STATUS.PLAYER2.CHESS_COUNT++;
        }
      }
    }
    if(this.scene.STATUS.PLAYER1.CHESS_COUNT === 0){
      this.scene.STATUS.STAGE = "GAMEOVER";
      this.scene.STATUS.WIN_PLAYER = "player2";
      // this.scene.clearGame();
    }

    if(this.scene.STATUS.PLAYER2.CHESS_COUNT === 0){
      this.STATUS.STAGE = "GAMEOVER";
      this.scene.STATUS.WIN_PLAYER = "player1";
      // this.scene.clearGame();
    }
  }
  /*==============================
  移動後のステージ上のアイテムチェック
  ------------------------------*/    
  getStageItem(posInt,chess,mode){
    let itemIndex;
    let item;
    let getItem = "";
    if(this.scene.itemMap[posInt.Y][posInt.X] !== 0){
      itemIndex = this.scene.itemMap[posInt.Y][posInt.X];
      item = this.playerItemGroup.children.entries[itemIndex-1];
      if(item){
        if(item.fireType === mode){
          this.playerItemGroup.children.entries[itemIndex-1] = 0;
          getItem =  item;  
        }
      }  
    }
    if(this.scene.itemMap2[posInt.Y][posInt.X] !== 0){
      itemIndex = this.scene.itemMap2[posInt.Y][posInt.X];
      item = this.playerItemGroup2.children.entries[itemIndex-1];
      if(item){
        if(item.fireType === mode){
          this.playerItemGroup2.children.entries[itemIndex-1] = 0;
          getItem =  item;  
        }
      }  
    }
    return getItem;
  }
  /*==============================
  ステージの更新
  ------------------------------*/      
  updateStage(){
    let chessMapData = this.scene.chessMapData;
    let chessMapData2 = this.scene.chessMapData2;
    this.stageMapAll = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ];
    for(var i = 0; i < chessMapData.length; i++){
      for(var k = 0; k < chessMapData[i].length; k++){
        if(chessMapData[i][k] !== 0){
          this.stageMapAll[i][k] = chessMapData[i][k];
        }
        if(chessMapData2[i][k] !== 0){
          this.stageMapAll[i][k] = chessMapData2[i][k];
        }
      }
    }

  }
  /*==============================
  アイテムの更新
  ------------------------------*/      
  updateStageTrap(mode){
    let selectedItem = this.UIManager.selectedItem;
    let itemIndex    = selectedItem.itemIndex;
    let pos          = this.UIManager.selectedItemPos.intPos;

    if(mode === "ADD"){
      this.scene.itemMap[pos.Y][pos.X] = itemIndex + 1;
    }
    if(mode === "DEL"){
      this.scene.itemMap[pos.Y][pos.X] = 0;
    }

    /*表示の更新*/
    this.UIManager.updateStageTrap(mode);
  }
  /*==============================
  ゲームオーバー
  ------------------------------*/      
  gameover(){

  }
  /*==============================
  ステージタッチ時
  ------------------------------*/
  touchStage(pos){
    if(this.scene.STATUS.STAGE_MODE === "FIN"){
      return false;
    }
    let worldPos = this.getWorldPos(pos);
    this.UIManager.showCusor(worldPos);

    /*チェス選択時*/
    if(this.selectedChess){
      /*攻撃可能*/
      if(this.selectedChess.areaMap[pos.Y][pos.X] === 3 || this.selectedChess.areaMap[pos.Y][pos.X] === 2){
        if(this.getChessFromPos(pos)){
          this.attackedChess = this.getChessFromPos(pos);
          this.UIManager.openWindow('ATTACK');
          return;
        }
      }
      /*移動可能*/
      if(this.selectedChess.areaMap[pos.Y][pos.X] === 0){
        if(pos.X === this.beforePos.X && pos.Y === this.beforePos.Y){
          if(this.STATUS.MOVE === "FIN"){
            return;
          }
          /*選択していたチェスの位置をリセット*/
          this.selectedChess.move(
            this.getWorldPos(this.beforePos),
            this.beforePos
          );
          // this.selectedChess = "";
          this.UIManager.closeWindow('MOVE');
          this.STATUS.MOVE = "";
          return;     
        }
      }
      if(this.selectedChess.areaMap[pos.Y][pos.X] === 3 || this.selectedChess.areaMap[pos.Y][pos.X] === 1 ){
        if(this.STATUS.MOVE === "FIN"){
          return;
        }
        this.selectedChess.move(worldPos,pos);
        this.UIManager.openWindow('MOVE');
        return;
      }
    }

    /*チェス未選択時　チェスを保存*/
    if(this.getChessFromPos(pos)){
      if(this.STATUS.MOVE === "FIN" || this.STATUS.ATTACK === "FIN"){
        return;
      }
      /*相手の駒は選べない*/
      if(this.scene.chessMapData2[pos.Y][pos.X] !== 0){
        return;
      }
      if(this.selectedChess){
        /*選択していたチェスの位置をリセット*/
        this.selectedChess.move(
          this.getWorldPos(this.beforePos),
          this.beforePos
        );
      }

      this.selectedChess = this.getChessFromPos(pos);

      this.beforePos = pos;//移動前の位置を保存

      this.StageManager.showMoveArea({
        pos   : pos,
        chess : this.selectedChess,
        mapAll: this.stageMapAll,
        map   : this.scene.chessMapData,
        map2  : this.scene.chessMapData2
      });
    }
  }
  /*==============================
  移動・攻撃完了
  ------------------------------*/
  actionChessMove(status){
    let beforeMovePos = this.beforePos;
    let NextMovePos = this.selectedChess.tilePos;
    let chessIndex;
    let map  = this.scene.chessMapData;

    if(status === "YES"){
      /*チェスデータの更新*/
      chessIndex = this.selectedChess.groupIndex;
      // for(var i = 0; i < map.length; i++){
      //   for(var k = 0; k < map[i].length; k++){
      //     if(map[i][k] === chessIndex){
      //       map[i][k] = 0;
      //     }
      //   }
      // }
      map[beforeMovePos.Y][beforeMovePos.X] = 0;
      map[NextMovePos.Y][NextMovePos.X] = chessIndex;
      this.scene.chessMapData = map;
      /*アイテムのチェック*/
      let getItem = this.getStageItem(NextMovePos,this.selectedChess,'STEP_ON');

      if(getItem){
        this.scene.itemMap[this.selectedChess.tilePos.Y][this.selectedChess.tilePos.X] = 0;
        this.scene.itemMap2[this.selectedChess.tilePos.Y][this.selectedChess.tilePos.X] = 0;    
        this.scene.itemFiring(getItem,this.selectedChess);
      }

      /*ステージのアップデート*/
      this.updateStage();
      this.StageManager.showMoveArea({
        pos   : NextMovePos,
        chess : this.selectedChess,
        mapAll: this.stageMapAll,
        map   : this.scene.chessMapData,
        map2  : this.scene.chessMapData2
      });
      this.UIManager.fin('MOVE');   
    }
    if(status === "NO"){
      let beforeSetPos = this.getWorldPos(beforeMovePos);
      
      this.selectedChess.move(this.getWorldPos(beforeMovePos),beforeMovePos);
      //  = beforeSetPos.x;
      // this.selectedChess.y = beforeSetPos.y;
      this.STATUS.MOVE = "";
    }
  }
  /*==============================
  攻撃完了
  ------------------------------*/
  actionChessAction(status){

    if(status === "YES"){
      let attackPos = this.attackedChess.tilePos;
      this.UIManager.fin('ATTACK'); 
      this.StageManager.hideMoveArea();
      /*アイテムのチェック*/
      let getItem = this.getStageItem(attackPos,this.selectedChess,'ATTACKED');
      if(getItem){
        this.scene.itemMap[attackPos.Y][attackPos.X] = 0;
        this.scene.itemMap2[attackPos.Y][attackPos.X] = 0;        
        this.scene.itemFiring(getItem,this.selectedChess);

      }else{
        // let targetChess = _this.scene.GameManager.StageManager.CreateChessGroup2.addGroup.children.entries[this.attackedChess.groupIndex - 1];

        this.selectedChess.attack(this.attackedChess);
      }
      // this.scene.chengeStageMode('FIN');
    }    
    if(status === "NO"){
    }
  }
  /*==============================
  自分のターン完了
  ------------------------------*/   
  turnFin(){
    this.STATUS.MOVE = "";
    this.STATUS.ATTACK = "";    
    this.selectedChess = "";
    this.beforePos = {
      X: 0,
      Y: 0
    }
    if(this.scene.STATUS.TURN === "PLAYER1"){
      this.scene.STATUS.TURN = "PLAYER2";
      this.NPC.myTurn();
    }else{
      // this.NPC.turnFin();
      this.scene.STATUS.TURN = "PLAYER1";
    }
    this.UIManager.turnFin();
    this.StageManager.turnFin();
  }
  /*==============================
  アイテム選択中
  ------------------------------*/   
  touchItem(pos,index){
    // let worldPos = this.getWorldPos(pos);
    // if(this.Layout.chessCount === 0){
    //   return false;
    // }
    this.UIManager.touchItem(pos,index);
  }
  /*==============================
  アイテム設置
  ------------------------------*/   
  touchCanPutTile(pos,index){
    let setPos = {
      intPos: pos,
      worldPos: this.getWorldPos(pos)
    };
    this.playerItemGroup.children.entries[index].x = setPos.worldPos.x;
    this.playerItemGroup.children.entries[index].y = setPos.worldPos.y;
    this.playerItemGroup.children.entries[index].depth = 400;
    // this.playerItemGroup.children.entries[index].item_frame.setVisible(true);
    // this.playerItemGroup.children.entries[index].item_frame.depth = 9;
    // this.playerItemGroup.children.entries[index].item_frame.x = setPos.worldPos.x;
    // this.playerItemGroup.children.entries[index].item_frame.y = setPos.worldPos.y;
    this.UIManager.touchCanPutTile(setPos,index);
  }
  /*==============================
  アイテムのキャンセル
  ------------------------------*/    
  setItemCancel(){
    this.UIManager.setItemCancel();
  }
  /*==============================
  アイテムの発火
  ------------------------------*/   
  itemFiring(item,chess){
    this.UIManager.itemFiring(item,chess);
  }
  /*==============================
  インフォタイルのタッチ
  ------------------------------*/   
  touchInfoTile(pos){
    let infoChess = this.getChessFromPos(pos);
    if(infoChess){
      this.UIManager.infoWindowOpen(infoChess);
    }
  }
  /*==============================
  アイテム、インフォのウインドウ表示
  ------------------------------*/   
  menuWindow(mode,status){
    // this.StageManager.hideMoveArea();
    // this.UIManager.menuClose();
    if(mode === "ITEM"){
      if(status === "OPEN"){
        this.UIManager.menuItemOpen();
        this.UIManager.menuInfoClose();
      }else{
        this.UIManager.menuClose();
      }
    }
    if(mode === "INFO"){
      if(status === "OPEN"){
        this.UIManager.menuInfoOpen();
        this.UIManager.menuItemClose();
      }else{
        this.UIManager.menuClose();
      }
    }
  }

  /*==============================
  world座標からXY座標を返す
  ------------------------------*/
  getIntPos(pos){
    let createStage = this.StageManager.CreateStage;
    let setIntPos = {
      X: (pos.x - createStage.layer.x - 16) / createStage.tileWidth,
      Y: (pos.y - createStage.layer.y - 16) / createStage.tileHeight
    }
    return setIntPos;
  }
  /*==============================
  XY座標からworld座標を返す
  ------------------------------*/
  getWorldPos(pos){
    let createStage = this.StageManager.CreateStage;
    let setWorldPos = {
      x: pos.X * createStage.tileWidth + createStage.layer.x + 16,
      y: pos.Y * createStage.tileHeight + createStage.layer.y + 16
    }
    return setWorldPos;
  }
  /*==============================
  XYからチェスを取得
  ------------------------------*/
  getChessFromPos(pos){

    let map  = this.scene.chessMapData;
    let map2 = this.scene.chessMapData2;
    // let chessGroupIndex;
    let chess;

    /*検索*/
    if(map[pos.Y][pos.X] !== 0){
      // chessGroupIndex = Number(map[pos.Y][pos.X]);
      this.playerChessGroup.children.entries.forEach(
        (sprite,index) => {
          if(sprite.tilePos.X === pos.X && sprite.tilePos.Y === pos.Y){
            chess = sprite;
          }
        }
      );      
    }
    if(map2[pos.Y][pos.X] !== 0){
      // chessGroupIndex = Number(map2[pos.Y][pos.X]);
      this.playerChessGroup2.children.entries.forEach(
        (sprite,index) => {
          if(sprite.tilePos.X === pos.X && sprite.tilePos.Y === pos.Y){
            chess = sprite;
          }
        }
      ); 
    }


    if(chess){
      return chess;
    }else{
      return false;
    }
  }
}