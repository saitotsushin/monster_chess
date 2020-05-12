import UIManager     from './UIManager';
import StageManager     from './StageManager';
import Layout     from './stage/Layout';

export default class GameManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;
    // this.playerChessGroup = this.scene.add.group();
    this.stageMapAll = [];

    this.playerChessGroup;
    this.playerChessGroup2;
    this.playerItemGroup;
    this.playerItemGroup2;

    this.itemMap = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];

    this.selectedChess;
    this.beforePos = {
      X: 0,
      Y: 0
    };
    this.STATUS = {
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
    
  }
  /*==============================
  初期化
  ------------------------------*/
  initScene(setting){
    this.UIManager.initScene();
    this.StageManager.initScene({
      map: setting.map,
      chessData: setting.chessData,
      layoutData: setting.layoutData
    });
    this.Layout.initScene();

    /*相手のチェスを生成*/
    this.playerChessGroup2 = this.scene.add.group();
    let setting2 = {
      addGroup: this.playerChessGroup2,//追加するグループ
      chessData: this.scene.registry.list.chessData2,//チェスデータ
      layoutData: this.scene.registry.list.layoutData2,//レイアウトデータ
      playerType: 'player2'
    }    
    this.StageManager.createEnemyGroup(setting2);

    /*トラップを生成*/
    this.playerItemGroup = this.scene.add.group();
    
    let setting_item = {
      addGroup: this.playerItemGroup,//追加するグループ
      itemData: this.scene.registry.list.itemData,//チェスデータ
      playerType: 'player1'
    }

    this.UIManager.createItemGroup(setting_item);

    this.playeritemGroup2 = this.scene.add.group();

    let setting_item2 = {
      addGroup: this.playeritemGroup2,//追加するグループ
      itemData: this.scene.registry.list.itemData2,//チェスデータ
      playerType: 'player2'
    }    
    this.UIManager.createItemGroup(setting_item2);

    /*ステージ配置用のトラップタイルを生成*/
    this.UIManager.createItemStage();

  }
  /*==============================
  レイアウト完了
  ------------------------------*/      
  layoutFin(){
    /*自分のチェスを生成*/
    this.playerChessGroup = this.scene.add.group();
    let setting = {
      addGroup: this.playerChessGroup,//追加するグループ
      chessData: this.scene.registry.list.chessData,//チェスデータ
      layoutData: this.scene.registry.list.layoutData,//レイアウトデータ
      playerType: 'player1'
    }
    this.StageManager.createChessGroup(setting);
    this.scene.startGame();
  }
  /*==============================
  ゲームスタート
  ------------------------------*/      
  startGame(){
    this.updateStage();
    this.UIManager.startGame();
  }   
  /*==============================
  ステージの更新
  ------------------------------*/      
  updateStage(){
    let layoutData = this.scene.registry.list.layoutData;
    let layoutData2 = this.scene.registry.list.layoutData2;
    this.stageMapAll = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    for(var i = 0; i < layoutData.length; i++){
      for(var k = 0; k < layoutData[i].length; k++){
        if(layoutData[i][k] !== 0){
          this.stageMapAll[i][k] = layoutData[i][k];
        }
        if(layoutData2[i][k] !== 0){
          this.stageMapAll[i][k] = layoutData2[i][k];
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
    // let itemMap     = this.scene.registry.list.itemMap;
    console.log("itemIndex",itemIndex)
    console.log("pos",pos)

    if(mode === "ADD"){
      this.itemMap[pos.Y][pos.X] = itemIndex + 1;
    }
    if(mode === "DEL"){
      this.itemMap[pos.Y][pos.X] = 0;
    }


    /*アイテムデータの更新*/
    this.scene.registry.list.itemMap = this.itemMap;
    console.log("this.scene.registry.list.itemMap",this.scene.registry.list.itemMap)
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
        map   : this.scene.registry.list.layoutData,
        map2  : this.scene.registry.list.layoutData2
      });
    }
  }
  /*==============================
  移動完了
  ------------------------------*/
  actionChessMove(status){
    let beforeMovePos;
    let NextMovePos = this.selectedChess.pos;
    let chessIndex;
    let map  = this.scene.registry.list.layoutData;
    if(status === "YES"){
      /*チェスデータの更新*/
      chessIndex = this.selectedChess.groupIndex;
      for(var i = 0; i < map.length; i++){
        for(var k = 0; k < map[i].length; k++){
          if(map[i][k] === chessIndex){
            map[i][k] = 0;
          }
        }
      }
      map[NextMovePos.Y][NextMovePos.X] = chessIndex;
      this.scene.registry.list.layoutData = map;
      this.updateStage();
      this.StageManager.showMoveArea({
        pos   : NextMovePos,
        chess : this.selectedChess,
        mapAll: this.stageMapAll,
        map   : this.scene.registry.list.layoutData,
        map2  : this.scene.registry.list.layoutData2
      });
      this.UIManager.fin('MOVE');   
    }
    if(status === "NO"){
      beforeMovePos = this.getWorldPos(this.beforePos);
      this.selectedChess.x = beforeMovePos.x;
      this.selectedChess.y = beforeMovePos.y;
    }
  }
  /*==============================
  攻撃完了
  ------------------------------*/
  actionChessAction(status){
    if(status === "YES"){
      this.UIManager.fin('ATTACK'); 
      this.StageManager.hideMoveArea();
    }    
    if(status === "NO"){
    }
  }
  /*==============================
  自分のターン完了
  ------------------------------*/   
  turnFin(){
    this.UIManager.turnFin();
    this.StageManager.turnFin();
  }
  /*==============================
  アイテム選択中
  ------------------------------*/   
  touchItem(pos,index){
    // let worldPos = this.getWorldPos(pos);
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
    this.UIManager.touchCanPutTile(setPos,index);
  }  
  /*==============================
  アイテム、インフォのウインドウ表示
  ------------------------------*/   
  menuWindow(mode,status){
    this.StageManager.hideMoveArea();

    if(mode === "ITEM"){
      if(status === "OPEN"){
        this.UIManager.menuItemOpen();
      }else{
        this.UIManager.menuClose();
      }
    }
    if(mode === "INFO"){
      if(status === "OPEN"){
        this.UIManager.menuInfoOpen();
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
      X: (pos.x - createStage.layer.x) * createStage.tileWidth,
      Y: (pos.x - createStage.layer.y) * createStage.tileHeight
    }
    return setIntPos;
  }
  /*==============================
  XY座標からworld座標を返す
  ------------------------------*/
  getWorldPos(pos){
    let createStage = this.StageManager.CreateStage;
    let setWorldPos = {
      x: pos.X * createStage.tileWidth + createStage.layer.x + 10,
      y: pos.Y * createStage.tileHeight + createStage.layer.y + 10
    }
    return setWorldPos;
  }
  /*==============================
  XYからチェスを取得
  ------------------------------*/
  getChessFromPos(pos){

    let map  = this.scene.registry.list.layoutData;
    let map2 = this.scene.registry.list.layoutData2;
    let chessGroupIndex;
    let chess;

    /*検索*/
    if(map[pos.Y][pos.X] !== 0){
      chessGroupIndex = Number(map[pos.Y][pos.X]);
      chess = this.playerChessGroup.children.entries[chessGroupIndex - 1];
    }
    if(map2[pos.Y][pos.X] !== 0){
      chessGroupIndex = Number(map2[pos.Y][pos.X]);
      chess = this.playerChessGroup2.children.entries[chessGroupIndex - 1];
    }


    if(chess){
      return chess;
    }else{
      return false;
    }
  }
}