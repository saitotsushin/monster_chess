import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import * as Prop       from './FunctionStageProp';

export default class Network {
  constructor(config) {
    this.scene = config.scene;
    
  }
  create(){
    /*------------------
    通信対戦用：レイアウト設定済みかの監視
    ------------------*/
    /*通信対戦用*/
    this.DB_host;
    this.DB_guest;
    this.myUID = firebase.auth().currentUser;
    this.groupIndex;
    this.pos;
    this.condition;//状態
    this.attackPoint;//
    this.itemIndex;
    // this.damagePoint;

    /*ページタイトル　オンライン*/
    this.textWait = this.scene.add.bitmapText(
      this.scene.game.config.width/2,
      // 20,
      60,
      'bitmapFont',
      'WAIT...',
      10
    );    
    this.textWait.setOrigin(0.5,0.5);
    this.textWait.setVisible(false);
    this.textWait.depth = 104;
    var _this = this;
    var count = 0;
    var alertmsg = function(){
      switch( count % 4 ) {

        case 0:
          _this.textWait.setText(['WAIT   ']);
          break;
        case 1:
          _this.textWait.setText(['WAIT.  ']);
          break;
        case 2:
          _this.textWait.setText(['WAIT.. ']);
          break;
        case 3:
          _this.textWait.setText(['WAIT...']);
          break;
      }
      count++;    
    }
    
    this.watingTimer = setInterval(alertmsg, 1000);

    if(this.scene.registry.list.gameMode === "NET"){
      /*------------------
      通信対戦用：部屋の監視
      ------------------*/      
      let ref = global_DB.ref("/stage/" + global_roomID);

      let setData = {
        key: "test",
        hp: 10
      };
      var updates = {};
      updates["/stage/" + global_roomID + "/player1/ChessGroup/chess1/"] = setData;
      firebase.database().ref("/stage/" + global_roomID).update(updates);

      let _this = this;

      let DB_room = firebase.database().ref("/stage/" + global_roomID);
      let DB_layout = firebase.database().ref("/stage/" + global_roomID + "/layout/");
      let DB_syncMoveChess = firebase.database().ref("/stage/" + global_roomID + "/syncMoveChess/");
      let DB_syncAttackChess = firebase.database().ref("/stage/" + global_roomID + "/syncAttackChess/");
      let DB_syncitem = firebase.database().ref("/stage/" + global_roomID + "/syncitem/");
      let DB_syncFireditem = firebase.database().ref("/stage/" + global_roomID + "/syncFireditem/");

      let DB_syncTurn = firebase.database().ref("/stage/" + global_roomID + "/turn/");

      DB_room.on('child_changed', function(data) {
        DB_layout.once('value', function(snapshot) {
          if(snapshot.val() === 2){
            /*２で完了 */
            DB_room.off();//リスナーのデタッチ、コールバックを削除
            _this.textWait.setVisible(false);
            clearInterval(_this.watingTimer);
            _this.setNetDistributionPlayer();
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

      /*------------------
      通信対戦用：移動する駒の監視
      ------------------*/
      /*
        value: どんな更新であってもオブジェクトそのものを取得する
      */
      DB_syncMoveChess.on('value', function(data) {
        let pos = data.val().nextChessPos;
        let groupIndex = data.val().groupIndex;
        if(_this.scene.StageManager.STATUS.TURN !== _this.scene.PlayerManager.PLAYER_NUMBER){
          if(pos){
            _this.moveSyncMoveChess(groupIndex,pos);
          }
        }
      });
      /*------------------
      通信対戦用：攻撃する駒の監視
      ------------------*/
      /*
        value: どんな更新であってもオブジェクトそのものを取得する
      */
      // this.attackFlg = false;
      DB_syncAttackChess.on('child_changed', function(data) {

        DB_syncAttackChess.on('value', function(data) {

          let groupIndex = data.val().groupIndex;
          let attackPoint = data.val().attackPoint;
          let mode = data.val().mode;
          let condition = data.val().condition;
          if(_this.scene.StageManager.STATUS.TURN !== _this.scene.PlayerManager.PLAYER_NUMBER){
            // if(_this.attackFlg === false){

              

              _this.moveSyncAttackChess(
                groupIndex,
                mode,
                attackPoint,
                condition
              );
              
            // }
          }
        });
      });
      /*------------------
      通信対戦用：トラップの設置
      ------------------*/
      /*
        value: どんな更新であってもオブジェクトそのものを取得する
      */
      DB_syncitem.on('child_changed', function(data) {

        DB_syncitem.on('value', function(data) {

         let groupIndex = data.val().itemIndex;
         let nextPos = {
           X: data.val().nextPosX,
           Y: data.val().nextPosY
         }
         if(_this.scene.StageManager.STATUS.TURN !== _this.scene.PlayerManager.PLAYER_NUMBER){
          //  if(_this.attackFlg === false){
             _this.setSyncitem(
               groupIndex,
               nextPos
             );
             
          //  }
         }
       });
     });
      /*------------------
      通信対戦用：トラップの発火
      ------------------*/
      /*
        value: どんな更新であってもオブジェクトそのものを取得する
      */
      DB_syncFireditem.on('child_changed', function(data) {

        DB_syncFireditem.on('value', function(data) {

          let groupIndex = data.val().itemIndex;
          let player = data.val().player;
          let pos = {
            X: data.val().posX,
            Y: data.val().posY
          };


          _this.setSyncFireditem(groupIndex,player,pos)

        });
      });
     DB_syncTurn.on('value', function(data) {
        _this.scene.StageManager.STATUS.TURN = data.val();
        _this.syncTurn();
      });
    }
  }

  /*==================
  通信対戦：ステージの更新
  ==================*/  
  setNetDistributionPlayer(){
    let DB_stage;
    let player1Stage;
    let player2Stage;
    let DB_player2stage;
    let DB_player2group;
    let _this = this;
    if(this.DB_host === this.myUID.uid){
      /*先行 host*/
      this.scene.PlayerManager.PLAYER_NUMBER = "player1";
      player2Stage = firebase.database().ref("/stage/" + global_roomID + "/player2/");
      player2Stage.once('value', function(snapshot) {
        DB_player2group = snapshot.val().group;
        DB_player2stage = snapshot.val().stage;
        _this.finLayout(DB_player2group,DB_player2stage);
      });
    }else{
      /*後攻 guest*/
      this.scene.PlayerManager.PLAYER_NUMBER = "player2";
      player2Stage = firebase.database().ref("/stage/" + global_roomID + "/player1/");
      player2Stage.once('value', function(snapshot) {
        DB_player2group = snapshot.val().group;
        DB_player2stage = snapshot.val().stage;
        _this.finLayout(DB_player2group,DB_player2stage);
      });
    }
  }
  finLayout(DB_chessGroup,DB_player2stage){
    let set_playerStage = [0,0,0];
    set_playerStage[0] = DB_player2stage.row1;
    set_playerStage[1] = DB_player2stage.row2;
    set_playerStage[2] = DB_player2stage.row3;
    this.scene.PlayerManager.player2Auto_Arr[5] = set_playerStage[0];
    this.scene.PlayerManager.player2Auto_Arr[6] = set_playerStage[1];
    this.scene.PlayerManager.player2Auto_Arr[7] = set_playerStage[2];
    this.scene.PlayerManager.player2_ChessList = DB_chessGroup;

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
  /*==================
  レイアウトの完了 -> ゲームスタート
  ==================*/
  netGameStart(){
    // let _this = this;
    /*各プレイヤーがレイアウト完了したかをカウントする */
  
    
  }
  setDBLayout(){
    let setDB_playerStage = [0,0,0];
    setDB_playerStage[0] = this.scene.PlayerManager.player1Auto_Arr[5];
    setDB_playerStage[1] = this.scene.PlayerManager.player1Auto_Arr[6];
    setDB_playerStage[2] = this.scene.PlayerManager.player1Auto_Arr[7];
    let DB_stage;
    var updates = {};
    let stageData
    let _this = this;
    this.textWait.setVisible(true);
    if(this.DB_host === this.myUID.uid){
      /*先行 host*/
      stageData = {
        row1: setDB_playerStage[0],
        row2: setDB_playerStage[1],
        row3: setDB_playerStage[2]
      };
      updates["/stage/" + global_roomID + "/player1/stage/"] = stageData;
      updates["/stage/" + global_roomID + "/player1/group/"] = this.scene.PlayerManager.player1_ChessList;
      firebase.database().ref().update(updates).then((snapshot) => {
        _this.layoutCount();
      });

    }else{
      /*後攻 guest*/
      this.scene.StageManager.STATUS.STAGE ="WAIT";
      stageData = {
        row1: setDB_playerStage[0],
        row2: setDB_playerStage[1],
        row3: setDB_playerStage[2]
      };
      updates["/stage/" + global_roomID + "/player2/stage/"] = stageData;
      updates["/stage/" + global_roomID + "/player2/group/"] = this.scene.PlayerManager.player1_ChessList;
      firebase.database().ref().update(updates).then((snapshot) => {
        _this.layoutCount();
      });
    }    
  }
  layoutCount(){
    let DB_layout = firebase.database().ref("/stage/" + global_roomID + "/layout/");
    let _this = this;
    DB_layout.once('value', function(snapshot) {
      let layoutCount = snapshot.val() + 1;
      DB_layout.set(layoutCount);
    });  
  }
  /*==============================
  移動DBの更新
  ------------------------------*/
  setDBMoveChess(){
    this.groupIndex = this.scene.PlayerManager.selectedChess.groupIndex;
    this.pos = this.scene.StageManager.nextChessPos;  
    let _this = this;
    var updates = {};
    let setObject = {
      groupIndex: this.groupIndex,
      nextChessPos: this.pos,
      player: this.scene.PlayerManager.PLAYER_NUMBER
    }
    updates["/stage/" + global_roomID + "/syncMoveChess/"] = setObject;
    firebase.database().ref().update(updates).then((snapshot) => {
      _this.scene.StageManager.finMove();
    });
  }
  /*==============================
  攻撃DBの更新
  ------------------------------*/
  setDBAttackChess(_mode){
    // this.condition = this.condition;
    this.groupIndex = this.scene.PlayerManager.selectedChess.groupIndex;
    // let attackPoint = this.scene.PlayerManager.selectedChess.status.p
    // this.pos = this.scene.StageManager.nextChessPos;  
    let _this = this;
    var updates = {};
    let setObject = {
      groupIndex: this.groupIndex,
      attackPoint: this.attackPoint,
      condition: this.condition,
      mode: _mode,
      player: this.scene.PlayerManager.PLAYER_NUMBER
    }
    updates["/stage/" + global_roomID + "/syncAttackChess/"] = setObject;
    firebase.database().ref().update(updates).then((snapshot) => {
      // _this.scene.StageManager.finAttack();
    });
  }
  /*==============================
  同期してからの処理（移動）
  ------------------------------*/  
  moveSyncMoveChess(_groupIndex,_nextPos){
    let chess;
    let nextPos = _nextPos;
    nextPos.X = 5 - nextPos.X;
    nextPos.Y = 7 - nextPos.Y;
    let beforePos = {
      X: 0,
      Y: 0
    };
    if(this.scene.StageManager.STATUS.TURN !== this.scene.PlayerManager.PLAYER_NUMBER){
      chess = this.scene.PlayerManager.player2ChessGroup.children.entries[_groupIndex - 1];
      beforePos.X = chess.pos.X;
      beforePos.Y = chess.pos.Y;
      this.scene.StageManager.beforeChessPos = beforePos;
      this.scene.StageManager.nextChessPos   = nextPos;
      this.scene.StageManager.moveChess(chess,nextPos,chess.pos);
      /*リセット*/
      this.scene.StageManager.nextPos = {
        X: 0,
        Y: 0
      };
      this.scene.StageManager.beforeChessPos = {
        X: 0,
        Y: 0
      };
    }
  }
  setitem(itemConfig){
    let item = itemConfig.selecteditem;
    this.itemIndex = itemConfig.index;
    let nextPos = itemConfig.nextPos;
    let _this = this;
    var updates = {};
    let setObject = {
      itemIndex: this.itemIndex,
      nextPosX: nextPos.X,
      nextPosY: nextPos.Y,
      player: this.scene.PlayerManager.PLAYER_NUMBER
    }
    updates["/stage/" + global_roomID + "/syncitem/"] = setObject;
    firebase.database().ref().update(updates).then((snapshot) => {
     
    });
  }
  fireditem(_itemIndex,_player,_pos){
    let setObject = {
      itemIndex: _itemIndex,
      player: _player,
      posX: _pos.X,
      posY: _pos.Y
    }
    var updates = {};
    updates["/stage/" + global_roomID + "/syncFireditem/"] = setObject;
    firebase.database().ref().update(updates).then((snapshot) => {
      
    });

  }
  setSyncFireditem(_itemIndex,_player,_pos){

    if(this.scene.StageManager.STATUS.TURN !== this.scene.PlayerManager.PLAYER_NUMBER){
      let pos = {
        X: 5 - _pos.X,
        Y: 7 - _pos.Y
      };
      if(this.scene.StageManager.tilePropMap[pos.Y][pos.X].item === ""){
        return;
      }
      let chess = this.scene.StageManager.tilePropMap[pos.Y][pos.X].object;
      let item = this.scene.StageManager.tilePropMap[pos.Y][pos.X].item;

      item.firing(chess);
      item.removeitem();
      item = "";
    }

  }
  setSyncitem(_itemIndex,_nextPos){   
    let item;
    let nextPos = {
      X: _nextPos.X,
      Y: _nextPos.Y
    };
    let selecteditem
    nextPos.X = 5 - nextPos.X;
    nextPos.Y = 7 - nextPos.Y;
    let itemConfig = {
      scene: this.scene,
      selecteditem: this.scene.itemManager.itemPlayer2Group.children.entries[_itemIndex],
      index: _itemIndex,
      nextPos: nextPos
    }
    Prop.setPropitem(itemConfig);
  }
  /*==============================
  同期してからの処理（攻撃）
  ------------------------------*/  
  moveSyncAttackChess(_groupIndex,_mode,_attackPoint,_condition){
    let chess;
    let mode = _mode;
    let attackPoint = _attackPoint;
    let condition = _condition;
    if(this.scene.StageManager.STATUS.TURN !== this.scene.PlayerManager.PLAYER_NUMBER){
      chess = this.scene.PlayerManager.player1ChessGroup.children.entries[_groupIndex - 1];
      chess.damage(attackPoint,mode,condition)
    }
  }
  /*==============================
  ターンの切り替え
  ------------------------------*/  
  changeTurn(){
    let ref = firebase.database().ref("/stage/" + global_roomID+"/turn/");
    let turn = this.scene.StageManager.STATUS.TURN;
    let _this = this;
    ref.set(turn).then((snapshot) => {
    });
  }
  /*==============================
  同期してからの処理（攻撃）
  ------------------------------*/  
  syncTurn(){

  }
}