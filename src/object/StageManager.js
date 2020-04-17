import StageData       from './StageData';
import StageLayer      from './stage/StageLayer';
import MoveArea        from './stage/MoveArea';
import TouchedTile     from './stage/TouchedTile';
import Layout          from './stage/Layout';
import ChessInfoWindow from './ui/setting/ChessInfoWindow';

import * as Search     from './stage/FunctionStageSearch';
import * as Init       from './stage/FunctionStageInit';
import * as Prop       from './stage/FunctionStageProp';

import firebase from 'firebase/app';
// import firebase = require("firebase/app");
import 'firebase/auth';
import 'firebase/database';

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
      },
      WIN_PLAYER: ''
    }

  }
  create(){


    /*ステージプロパティデータの読み込み*/
    this.StageData = new StageData({
      scene: this.scene
    });
    this.tilePropMap = this.StageData.tilePropMap;

    /*ステージの読み込みと設定*/
    this.StageLayer = new StageLayer({
      scene: this.scene,
      mapData: this.StageData.map1
    });

    /*タッチUIの生成*/
    this.TouchedTile = new TouchedTile({
      scene: this.scene
    });

    /*移動エリアの生成*/
    this.MoveArea = new MoveArea({
      scene: this.scene,
      StageManager: this
    });

    /*レイアウトの生成*/
    this.Layout = new Layout({
      scene: this.scene
    });

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

    /*通信対戦用*/
    this.DB_host;
    this.DB_guest;
    this.myUID = firebase.auth().currentUser;
    // update["/stage/" + global_roomID] = setData;
    console.log("global_roomID",global_roomID)
    let ref = global_DB.ref("/stage/" + global_roomID);

    let setData = {
      key: "test",
      hp: 10
    };
    var updates = {};
    updates["/stage/" + global_roomID + "/player1/ChessGroup/chess1/"] = setData;
    console.log("updates",updates)
    firebase.database().ref("/stage/" + global_roomID).update(updates);

    /*==================
    アニメーション
    ==================*/
    /*------------------
    爆発
    ------------------*/
    this.scene.anims.create({
      key: 'anime_explode',
      frames: this.scene.anims.generateFrameNumbers('anime_explode', { start: 0, end: 5 }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    });
    /*------------------
    攻撃：通常
    ------------------*/
    /*攻撃のsprite*/
    this.AnimeAttack = this.scene.add.sprite(
      20,
      184,
      'spritesheet',
      'chess_shadow'//ダミー//cursor_item
    );
    this.AnimeAttack.depth = 200;

    this.scene.anims.create({
      key: 'anime_attack',
      frames: this.scene.anims.generateFrameNumbers('anime_attack', { start: 0, end: 5 }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    });
    /*------------------
    通信対戦用：レイアウト設定済みかの監視
    ------------------*/
    if(this.scene.registry.list.gameMode === "NET"){
      let _this = this;
      let DB_room = firebase.database().ref("/stage/" + global_roomID);
      let DB_layout = firebase.database().ref("/stage/" + global_roomID + "/layout/");

      DB_room.on('child_changed', function(data) {
        console.info("レイアウト設定済み");
        DB_layout.once('value', function(snapshot) {
          if(snapshot.val() === 2){
            console.info("両プレイヤーのレイアウト設定完了");
            /*２で完了 */
            // _this.setNetDistributionPlayer();
          }
        });
      }); 
      /*host と guest のIDを取得して置く*/
      this.DB_host;
      this.DB_guest;
      let getDB_host = firebase.database().ref("/stage/" + global_roomID + "/host/");
      let getDB_guest = firebase.database().ref("/stage/" + global_roomID + "/guest/");
      getDB_host.once('value', function(snapshot) {
        _this.DB_host = snapshot.val();
      }); 
      getDB_guest.once('value', function(snapshot) {
        _this.DB_guest = snapshot.val();
      });
    } 
  }
  touchedStage(pos){

    if(this.STATUS.STAGE === "FIN"){
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

    if(tileProp){

      if(this.STATUS.STAGE === ''){

        if(tileProp.MODE === 'ATTACK'){
          this.scene.PlayerManager.targetChess = tileProp.object;
          modal.close();
          modal.open(tileProp.MODE);
        }
        if(tileProp.MODE === 'MOVE'){
          this.nextChessPos.X = tileProp.nextPos.X;
          this.nextChessPos.Y = tileProp.nextPos.Y;
          modal.open(tileProp.MODE);
        }
      }

      if(this.STATUS.STAGE === 'ITEM'){
        if(this.scene.PlayerManager.selectedTrap){
          this.nextChessPos.X = tileProp.nextPos.X;
          this.nextChessPos.Y = tileProp.nextPos.Y;
          this.scene.TrapManager.ModalItemSet.open();  
        }
      }
      if(tileProp.MODE === ""){
        modal.close();
      }
    }
    

    
  }
  turnFin(){
    Prop.updateAreaMap(this.scene)
    this.STATUS.TURN = 'player2';
    let selectedChess = Search.thinkAI(this.scene);
    this.scene.TrapManager.setTrapByRandom();//トラップを置くか（移動前）
    this.actChess(selectedChess);
    this.scene.TrapManager.setTrapByRandom();//トラップを置くか（移動後）
    this.STATUS.TURN = 'player1';
    this.STATUS.STAGE = "";
    this.scene.PlayerManager.movedChess = "";
    Prop.updateAreaMap(this.scene)    
  }
  /*==================
  敵のチェスの行動
  ==================*/
  actChess(selectedChess){
    let chess = selectedChess.chess;
    
    let pos = selectedChess.pos;
    let mode = selectedChess.mode;
    this.Cursor.x = selectedChess.x;
    this.Cursor.y = selectedChess.y;
    this.Cursor.setVisible(true);

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
  
  layoutChess(player){
    let playerArr = [];
    let group;
    if(player === "player1"){
      playerArr = this.scene.registry.list.player1Auto_Arr;
      group = this.scene.PlayerManager.player1ChessGroup;
    }
    if(player === "player2"){
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
  layoutFin(){
    // let _this = this;
  
    if(this.scene.registry.list.gameMode !== "NET"){
      this.scene.StageManager.layoutChess('player1');
      this.scene.StageManager.layoutChess('player2');
      Prop.setProp(
        this.scene,
        this.scene.PlayerManager.player1ChessGroup.children.entries,
        this.scene.PlayerManager.player2ChessGroup.children.entries
      );
    }else{  
      /*各プレイヤーがレイアウト完了したかをカウントする */
      let DB_layout = firebase.database().ref("/stage/" + global_roomID + "/layout/");
      DB_layout.once('value', function(snapshot) {
        let layoutCount = snapshot.val() + 1;
        DB_layout.set(layoutCount); 
      });    
    }
    
  }
  /*==================
  通信対戦：プレイヤーの先行後攻の振り分け
  ==================*/  
  setNetDistributionPlayer(){
    // let myUID = firebase.auth().currentUser;
    // console.log("myUID",myUID)
    console.log("this.DB_host",this.DB_host);
    if(this.DB_host === this.myUID.uid){
      /*先行 host*/
      console.log("先行です");
    }else{
      /*後攻 guest*/
      console.log("後攻です");
      this.STATUS.STAGE ="WAIT";
      // this.player2NetChessGroup.set(this.scene.PlayerManager.player1ChessGroup.children.entries);
    }
    this.setLayoutPlayers();
  }

  selectedLayoutChess(chess){
    this.STATUS.STAGE = "SELECTED_LAYOUT_CHESS";
    this.scene.PlayerManager.selectedChess = chess;
  }
  moveChess(chess,nextPos){
    let setNextPos = Prop.getTilePositionNumber(
      nextPos.X,
      nextPos.Y,
      this.scene
    );

   
    chess.move(
      setNextPos.world,
      nextPos
    );

    this.checkTrap(chess,nextPos);


    this.MoveArea.hide(chess);

    //ステージのプロパティと駒の移動エリアの更新
    Prop.updateStageProps(this.scene,chess);
    if(this.scene.registry.list.gameMode !== "NET"){
    }   
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
            this.tilePropMap[i][k].trap.firing(chess);
            this.tilePropMap[i][k].trap.removeTrap();
            this.tilePropMap[i][k].trap = "";
          }  
        }
      }
    }
  }

}