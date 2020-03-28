import StageData      from './StageData';
import StageLayer     from './stage/StageLayer';
import MoveArea       from './stage/MoveArea';
import TouchedTile    from './stage/TouchedTile';

import * as Search    from './stage/FunctionStageSearch';
import * as Layout    from './stage/FunctionStageLayout';
import * as Init      from './stage/FunctionStageInit';
import * as Prop      from './stage/FunctionStageProp';
import * as TileCheck from './stage/FunctionStageTileCheck';

export default class StageManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;

    this.STATUS = {
      STAGE: "INIT",
      CHESS: "",
      TURN: "player1",
      PLAYER1:{
        CHESS_COUNT: 0
      },
      PLAYER2:{
        CHESS_COUNT: 0
      }
    }

    /*ステージの読み込みと設定*/
    this.StageLayer = new StageLayer({
      scene: this.scene
    });

    /*ステージプロパティデータの読み込み*/
    this.StageData = new StageData({
      scene: this.scene
    });
    this.tilePropMap = this.StageData.tilePropMap;



    /*タッチUIの生成*/
    this.TouchedTile = new TouchedTile({
      scene: this.scene
    });

    /*移動エリアの生成*/
    this.MoveArea = new MoveArea({
      scene: this.scene,
      StageManager: this
    });

    // this.enemyChess = "";

    this.beforeChessPos = {
      X: 0,
      Y: 0
    }
    this.nextChessPos = {
      X: 0,
      Y: 0
    }
    /*ステージの初期化*/
    Init.initStage(this.tilePropMap);

    /*ステータスの更新*/
    // this.STATUS.PLAYER1.CHESS_COUNT = this.scene.PlayerManager.player1_ChessList.length;
    // this.STATUS.PLAYER2.CHESS_COUNT = this.scene.PlayerManager.player2_ChessList.length;

    /*初期のモーダル*/
    this.STATUS.STAGE = 'LAYOUT_AUTO'
    this.scene.ModalManager.open(this.STATUS.STAGE);

    /*レイアウト用の駒のグループ*/
    this.layoutChessGroup = this.scene.add.group();

  }
  touchedStage(pos){

    let X = pos.number.X;
    let Y = pos.number.Y;
    let tile = this.tilePropMap[Y][X];
    let tileProp = TileCheck.tileCheck(this.scene,tile,pos);
    let modal = this.scene.ModalManager;
    if(tileProp){
      if(tileProp.MODE && this.STATUS.STAGE !== 'FIN'){
        this.STATUS.STAGE = tileProp.MODE;
      }
      if(this.STATUS.STAGE === 'LAYOUT_MANUAL'){
        return;
      }  
      if(this.STATUS.STAGE === 'ATTACK'){
        this.scene.PlayerManager.targetChess = tileProp.object;
      }
      if(this.STATUS.STAGE === 'MOVE'){
        this.nextChessPos.X = tileProp.nextPos.X;
        this.nextChessPos.Y = tileProp.nextPos.Y;
      }
      if(this.STATUS.STAGE === 'SELECTED_TRAP'){
        this.nextChessPos.X = tileProp.nextPos.X;
        this.nextChessPos.Y = tileProp.nextPos.Y;
      }
    }
    if(this.STATUS.STAGE === 'SELECTED_LAYOUT_CHESS'){
      this.checkCanSetLayout(X,Y);
      return;
    }

    if(this.STATUS.STAGE !== ""){
      modal.open(this.STATUS.STAGE);
    }
    
  }
  modalYes(){
    let modal = this.scene.ModalManager;
    if(this.STATUS.STAGE === "LAYOUT_AUTO"){
      this.layoutChess('AUTO');
      return;
    }
    if(this.STATUS.STAGE === "ATTACK"){
      this.attackChess(
        this.scene.PlayerManager.selectedChess,
        this.scene.PlayerManager.targetChess,
      );
      if(this.STATUS.STAGE === "GAMEOVER"){
        return;
      }
      this.STATUS.STAGE = "FIN";
      modal.open(this.STATUS.STAGE);
      return;

    }
    if(this.STATUS.STAGE === "MOVE"){
      this.moveChess(
        this.scene.PlayerManager.selectedChess,
        this.nextChessPos
      );
      if(this.STATUS.STAGE === "GAMEOVER"){
        return;
      }
      this.STATUS.STAGE = "FIN";
      modal.open(this.STATUS.STAGE);
      return;

    }
    if(this.STATUS.STAGE === "SELECTED_TRAP"){
      let trapConfig = {
        scene: this.scene,
        selectedTrap: this.scene.PlayerManager.selectedTrap,
        index: this.scene.PlayerManager.selectedTrap.groupIndex,
        nextPos: {
          X: this.nextChessPos.X,
          Y: this.nextChessPos.Y
        }
      }
      Prop.setPropTrap(trapConfig);
      this.STATUS.STAGE = "FIN";
      modal.open(this.STATUS.STAGE);
      return;
    }
    if(this.STATUS.STAGE === "SELECTED_LAYOUT_CHESS"){
      this.setLayout();
      this.layoutChess('FIN');
      return;
    }
    if(this.STATUS.STAGE === "FIN"){
      Prop.updateAreaMap(this.scene)
      this.STATUS.TURN = 'player2';
      let selectedChess = Search.thinkAI(this.scene);
      this.scene.TrapManager.setTrapByRandom();//トラップを置くか（移動前）
      this.actChess(selectedChess);
      this.scene.TrapManager.setTrapByRandom();//トラップを置くか（移動後）
      this.STATUS.TURN = 'player1';
      this.STATUS.STAGE = "";
      Prop.updateAreaMap(this.scene)
    }
  }
  modalNo(){
    if(this.STATUS.STAGE === "LAYOUT_AUTO"){
      this.STATUS.STAGE = "LAYOUT_MANUAL"
      this.layoutChess('MANUAL');
      return;
    }
  }
  actChess(selectedChess){
    let chess = selectedChess.chess;
    
    let pos = selectedChess.pos;
    let mode = selectedChess.mode;
    // let pos = Prop.getTilePositionNumber(int.X,int.Y,this.scene)
    if(mode === "ATTACK"){
      let target = selectedChess.attackTarget;
      chess.attack(target);
    }
    if(mode === "MOVE"){
      this.beforeChessPos = {
        X: chess.pos.X,
        Y: chess.pos.Y
      }
      this.nextChessPos = {
        X: pos.X,
        Y: pos.Y
      } 
      this.moveChess(
        chess,
        pos
      );
      //リセット
      this.beforeChessPos = {
        X: 0,
        Y: 0,
      }
      this.nextChessPos = {
        X: 0,
        Y: 0
      }
    }
    

  }
  removeChess(chess){
    let posInt = {
      X: chess.pos.X,
      Y: chess.pos.Y
    }
    this.tilePropMap[posInt.Y][posInt.X].object = "";
    chess.icon_enemy.destroy();
    chess.destroy();
    this.STATUS.PLAYER1.CHESS_COUNT = 0;
    this.STATUS.PLAYER2.CHESS_COUNT = 0;

    for(var i = 0; i < this.tilePropMap.length; i++){
      for(var k = 0; k < this.tilePropMap[i].length; k++){
        if(this.tilePropMap[i][k].object.playerType === "player1"){
          this.STATUS.PLAYER1.CHESS_COUNT++;
        }
        if(this.tilePropMap[i][k].object.playerType === "player2"){
          this.STATUS.PLAYER2.CHESS_COUNT++;          
        }
      }
    }
    if(this.STATUS.PLAYER1.CHESS_COUNT === 0){
      this.STATUS.STAGE = "GAMEOVER";
      console.info("player1 LOSE");
    }
    if(this.STATUS.PLAYER2.CHESS_COUNT === 0){
      this.STATUS.STAGE = "GAMEOVER";
      console.info("player2 LOSE");
    }

  }
  
  layoutChess(mode){
    if(mode === "FIN"){
      Layout.layoutAuto(this.scene,"player1","fin");
      Layout.layoutAuto(this.scene,"player2","fin");
      Prop.setProp(this.scene);
      this.STATUS.STAGE = "";
    }
    if(mode === "AUTO"){
      Layout.layoutAuto(this.scene,"player1","auto");
      Layout.layoutAuto(this.scene,"player2","auto");
      Prop.setProp(this.scene);
      this.STATUS.STAGE = "";
    }
    if(mode === "MANUAL"){
      this.scene.ModalManager.open(this.STATUS.STAGE);

    }
  }
  selectedLayoutChess(chess){
    this.STATUS.STAGE = "SELECTED_LAYOUT_CHESS";
    this.scene.PlayerManager.selectedChess = chess;
  }
  checkCanSetLayout(X,Y){

    let chess = this.scene.PlayerManager.selectedChess;

    let checkMap = this.scene.PlayerManager.PlayerData.stageCanSetArr;

    if( checkMap[Y][X] === 1 ){
      let setNextPos = Prop.getTilePositionNumber(
        X,
        Y,
        this.scene
      );
      chess.x = setNextPos.world.x;
      chess.y = setNextPos.world.y;
      chess.pos.X = X;
      chess.pos.Y = Y;
    }
    let chessMaxCount = this.scene.PlayerManager.player1ChessGroup.children.entries.length;
    let chessGroup = this.scene.PlayerManager.player1ChessGroup.children.entries;
    let playerStageMap = this.scene.PlayerManager.player2_Arr;
    let chessCount = 0;

    for(var i = 0; i < chessGroup.length;i++){
      let chessChessX = chessGroup[i].pos.X;
      let chessChessY = chessGroup[i].pos.Y;
      if(checkMap[chessChessY][chessChessX] === 1){
        chessCount++;
      }
    }
    if(chessCount === chessMaxCount){
      this.scene.ModalManager.ModalLayout.setComplete();
    }    
    return;
  }
  setLayout(){
    this.layoutChessGroup.children.entries.forEach(
      (sprite,index) => {
        this.scene.PlayerManager.PlayerData.player1_Arr[sprite.pos.Y][sprite.pos.X] = index + 1;
      }
    );
  }
  moveChess(chess,nextPos){
    let setNextPos = Prop.getTilePositionNumber(
      nextPos.X,
      nextPos.Y,
      this.scene
    );

    this.checkTrap(chess,nextPos);
   
    chess.move(
      setNextPos.world,
      nextPos
    );



    this.MoveArea.hide(chess);

    //ステージのプロパティと駒の移動エリアの更新
    Prop.updateStageProps(this.scene,chess);    
  }
  attackChess(playerChess,enemyChess){   
    playerChess.attack(enemyChess);
    this.MoveArea.hide(enemyChess);
  }
  checkTrap(chess,nextPos){
    for(var i = 0; i < this.tilePropMap.length; i++){
      for(var k = 0; k < this.tilePropMap[i].length; k++){
        if(nextPos.X == k && nextPos.Y === i){
          if(this.tilePropMap[i][k].trap){
            this.tilePropMap[i][k].trap.attack(chess);
            this.tilePropMap[i][k].trap.removeTrap();
            this.tilePropMap[i][k].trap = "";
          }  
        }
      }
    }
  }
}