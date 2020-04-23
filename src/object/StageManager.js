import StageData       from './StageData';
import StageLayer      from './stage/StageLayer';
import MoveArea        from './stage/MoveArea';
import TouchedTile     from './stage/TouchedTile';
import Layout          from './stage/Layout';
import ChessInfoWindow from './ui/setting/ChessInfoWindow';
import NPC             from './stage/NPC';
// import * as Search     from './stage/FunctionStageSearch';
import * as Init       from './stage/FunctionStageInit';
import * as Prop       from './stage/FunctionStageProp';
import GameAnimations  from '../utils/GameAnimations';
import Network         from './stage/Network';



export default class StageManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;

    this.STATUS = {
      STAGE: "INIT",
      MOVE: "",//FIN or none
      ATTACK: "",
      CHESS: "",
      TURN: "player1",
      PLAYER1:{
        CHESS_COUNT: 0
      },
      PLAYER2:{
        CHESS_COUNT: 0
      },
      WIN_PLAYER: ''
    }

    this.PLAYER2 = "";

  }
  create(){
    if(this.scene.registry.list.gameMode !== "NET"){
      // this.PLAYER2 = "NPC";
      this.PLAYER2 = new NPC({scene: this.scene});
    }else{
      this.Network = new Network({scene: this.scene});
      this.Network.create();
    }
    /*ステージプロパティデータの読み込み*/
    this.StageData = new StageData({scene: this.scene});

    this.tilePropMap = this.StageData.tilePropMap;

    /*ステージの読み込みと設定*/
    this.StageLayer = new StageLayer({
      scene: this.scene,
      mapData: this.StageData.map1
    });

    /*タッチUIの生成*/
    this.TouchedTile = new TouchedTile({scene: this.scene});

    /*移動エリアの生成*/
    this.MoveArea = new MoveArea({
      scene: this.scene,
      StageManager: this
    });

    /*レイアウトの生成*/
    this.Layout = new Layout({scene: this.scene});

    /*チェスの情報のウインドウの生成*/
    this.ChessInfoWindow = new ChessInfoWindow({
      scene: this.scene
    });
    this.ChessInfoWindow.create();

    this.beforeChessPos = {
      X: 0,
      Y: 0
    }
    this.nextChessPos = {
      X: 0,
      Y: 0
    }
    
    /*カーソルの当たっているオブジェクト*/
    /*インフォ用*/
    this.nowObject;

    /*ステージの初期化*/
    Init.initStage(this.tilePropMap);
    Init.initiGroudType(this.tilePropMap,this.StageData.map1);
    this.scene.hideChessInfoWindow();

    /*初期のモーダル*/
    this.STATUS.STAGE = 'LAYOUT';
    this.Layout.setLayoutGroup();
    this.Layout.setLayoutChessToStage();

    /*レイアウト用の駒のグループ*/
    this.layoutChessGroup = this.scene.add.group();

    /*カーソル*/
    this.Cursor = this.scene.add.sprite(
      20,
      184,
      'spritesheet',
      'cursor_item'
    );
    this.Cursor.setVisible(false);

    /*==================
    アニメーション
    ==================*/
    this.GameAnimations = new GameAnimations({
      scene: this.scene
    });

  }
  touchedStage(pos){

    if(this.STATUS.MOVE === "FIN" && this.STATUS.ATTACK === "FIN"){
      return;
    }
    let X = pos.number.X;
    let Y = pos.number.Y;
    let tile = this.tilePropMap[Y][X];
    let tileProp = this.TouchedTile.tileCheck(tile,pos);
    let modal = this.scene.ModalManager;
    if(this.STATUS.STAGE === "INFO"){
      this.scene.showChessInfoWindow();
      this.ChessInfoWindow.setChessInfo(this.nowObject)
      return;
    }
    if(this.scene.registry.list.gameMode === "NET"){
      if(this.STATUS.TURN !== this.scene.PlayerManager.PLAYER_NUMBER){
        return;
      }else{
      }
    }    

    if(tileProp){
      if(this.STATUS.STAGE === 'ITEM'){
        if(this.scene.PlayerManager.selectedTrap){
          if(tileProp.object.playerType === "player1"){
            this.nextChessPos.X = tileProp.nextPos.X;
            this.nextChessPos.Y = tileProp.nextPos.Y;
            this.scene.TrapManager.ModalItemSet.open();  
          }
        }
        return;
      }

      // if(this.STATUS.STAGE === ''){

        if(tileProp.MODE === 'ATTACK'){
          if(this.STATUS.ATTACK === "FIN"){
            return;
          }          
          this.scene.PlayerManager.targetChess = tileProp.object;
          modal.close();
          modal.open(tileProp.MODE);
        }
        if(tileProp.MODE === 'MOVE'){
          if(this.STATUS.MOVE === "FIN"){
            return;
          }
          this.nextChessPos.X = tileProp.nextPos.X;
          this.nextChessPos.Y = tileProp.nextPos.Y;
          modal.open(tileProp.MODE);
        }
      // }

      if(tileProp.MODE === ""){
        modal.close();
      }
    }
    

    
  }
  turnFin(){
    Prop.updateAreaMap(this.scene);
    //ターンを反転
    if(this.STATUS.TURN === "player1"){
      this.STATUS.TURN = 'player2';
      if(this.scene.registry.list.gameMode !== "NET"){
        this.PLAYER2.myTurn();
      }
    }else{
      this.STATUS.TURN = 'player1';
    }
    if(this.scene.registry.list.gameMode === "NET"){
      // this.scene.StageManager.Network.attackFlg = false;
      this.scene.StageManager.Network.changeTurn();
    }     
    this.STATUS.STAGE = "";
    this.STATUS.ATTACK = "";
    this.STATUS.MOVE = "";
    this.movedChess = "";
    // this.Network.attackFlg = false
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
        if(this.tilePropMap[i][k].object !== ""){
          if(this.tilePropMap[i][k].object.playerType === "player1"){
            this.STATUS.PLAYER1.CHESS_COUNT++;
          }
          if(this.tilePropMap[i][k].object.playerType === "player2"){
            this.STATUS.PLAYER2.CHESS_COUNT++;          
          }  
        }
      }
    }
    if(this.STATUS.PLAYER1.CHESS_COUNT === 0){
      this.STATUS.STAGE = "GAMEOVER";
      console.info("player1 LOSE");
      this.STATUS.WIN_PLAYER = "player2";
      this.scene.ClearGame.open();
    }
    if(this.STATUS.PLAYER2.CHESS_COUNT === 0){
      this.STATUS.STAGE = "GAMEOVER";
      console.info("player2 LOSE");
      this.STATUS.WIN_PLAYER = "player1";
      this.scene.ClearGame.open();
    }

  }
  /*==================
  駒のレイアウト移動
  ==================*/  
  layoutChess(player){
    let playerArr = [];
    let group;
    if(player === "player1"){
      playerArr = this.scene.registry.list.player1Auto_Arr;
      group = this.scene.PlayerManager.player1ChessGroup;
    }
    if(player === "player2"){
      for(var i = 0; i < this.scene.PlayerManager.player2Auto_Arr.length; i++){
        this.scene.PlayerManager.player2Auto_Arr[i].reverse();
      }
      this.scene.PlayerManager.player2Auto_Arr.reverse();
      playerArr = this.scene.PlayerManager.player2Auto_Arr;
      group = this.scene.PlayerManager.player2ChessGroup;  
    }
    let chess;
    let position;
    for(var i = 0; i < playerArr.length;i++){
      for(var k = 0; k < playerArr[i].length;k++){
        if(playerArr[i][k] !== 0){
  
          position = Prop.getTilePositionNumber(k,i,this.scene);
  
          chess = group.children.entries[playerArr[i][k]-1];
          chess.depth = 10;
          if(player === 'player2'){
            chess.icon_enemy.setVisible(true);
          }
      
          chess.move(position.world,{X:k,Y:i})
        }
      }    
    }
  }
  /*==================
  レイアウトの完了 -> ゲームスタート
  ==================*/
  gameStart(){
    this.scene.PlayerManager.createPlayerGroup("player1");
    this.scene.PlayerManager.createPlayerGroup("player2");
    this.scene.StageManager.layoutChess('player1');
    this.scene.StageManager.layoutChess('player2');

    Prop.setProp(
      this.scene,
      this.scene.PlayerManager.player1ChessGroup.children.entries,
      this.scene.PlayerManager.player2ChessGroup.children.entries
    );
    
  }

  selectedLayoutChess(chess){
    this.STATUS.STAGE = "SELECTED_LAYOUT_CHESS";
    this.scene.PlayerManager.selectedChess = chess;
  }
  moveChess(chess,nextPos,test){
    if(this.scene.registry.list.gameMode !== "NET"){
      /*プレイヤー２からもらったデータは逆にして更新*/
    }
    let setNextPos = Prop.getTilePositionNumber(
      nextPos.X,
      nextPos.Y,
      this.scene
    );

    chess.move(
      setNextPos.world,
      nextPos
    );

    console.log("this.tilePropMap",this.tilePropMap)
    this.MoveArea.hide(chess);
   
    //ステージのプロパティと駒の移動エリアの更新
    Prop.updateStageProps(this.scene,chess);
    console.log("nextPos",nextPos)
    this.checkTrap(chess,nextPos);

  }
  finMove(){
    this.moveChess(
      this.scene.PlayerManager.selectedChess,
      this.scene.StageManager.nextChessPos
    );
    /*移動した駒の保存*/
    this.scene.PlayerManager.movedChess = this.scene.PlayerManager.selectedChess;
    let movedChess = this.scene.PlayerManager.movedChess;
    this.scene.StageManager.MoveArea.show(movedChess);

    this.STATUS.STAGE = "FIN";
    this.STATUS.MOVE = "FIN";
 
  }
  finAttack(){
    this.attackChess(
      this.scene.PlayerManager.selectedChess,
      this.scene.PlayerManager.targetChess,
    );

    if(this.scene.registry.list.gameMode === "NET"){
      this.scene.StageManager.Network.setDBAttackChess('ATTACK');
    }    
    this.STATUS.STAGE = "FIN";
    this.STATUS.ATTACK = "FIN";      
  }

  attackChess(playerChess,enemyChess){   
    playerChess.attack(enemyChess);
    this.MoveArea.hide(enemyChess);
  }
  checkTrap(chess,nextPos){
    console.log("checkTrap")
    console.log("this.tilePropMap",this.tilePropMap)
    for(var i = 0; i < this.tilePropMap.length; i++){
      for(var k = 0; k < this.tilePropMap[i].length; k++){
        if(nextPos.X == k && nextPos.Y === i){
          if(this.tilePropMap[i][k].trap){
            this.tilePropMap[i][k].trap.firing(chess);
            this.tilePropMap[i][k].trap.removeTrap();
            this.tilePropMap[i][k].trap = "";
          }  
        }
      }
    }
  }

}