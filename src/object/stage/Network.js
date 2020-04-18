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

    if(this.scene.registry.list.gameMode === "NET"){
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
      let DB_syncChess = firebase.database().ref("/stage/" + global_roomID + "/syncChess/");

      DB_room.on('child_changed', function(data) {
        DB_layout.once('value', function(snapshot) {
          console.info("snapshot.val()",snapshot.val());
          if(snapshot.val() === 2){
            console.info("両プレイヤーのレイアウト設定完了");
            /*２で完了 */
            DB_room.off();//リスナーのデタッチ、コールバックを削除
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
      /*
        value: どんな更新であってもオブジェクトそのものを取得する
      */
      DB_syncChess.on('value', function(data) {
        // DB_syncChess.once('value', function(snapshot) {
          console.info("駒::",data.val());
          console.log("this.scene.StageManager.STATUS.TURN",_this.scene.StageManager.STATUS.TURN)
          console.log("this.scene.PlayerManager.PLAYER_NUMBER",_this.scene.PlayerManager.PLAYER_NUMBER)
          let pos = data.val().nextChessPos;
          let groupIndex = data.val().groupIndex;
          if(_this.scene.StageManager.STATUS.TURN !== _this.scene.PlayerManager.PLAYER_NUMBER){
            console.log("turn ok!!!!");
            console.log("pos",pos)
            console.log("groupIndex",groupIndex)
            console.log("data",data.val())
            if(pos){
              _this.moveSyncChess(groupIndex,pos);
            }
          }
          // if(_this.scene.PlayerManager.selectedChess){
          // }
        // });
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



    // this.setLayoutPlayers();
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

      // DB_stage.once('value', function(snapshot) {
      // });
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
  setDBMoveChess(){
    this.groupIndex = this.scene.PlayerManager.selectedChess.groupIndex;
    this.pos = this.scene.StageManager.nextChessPos;  
    let _this = this;
    var updates = {};
    let setObject = {
      groupIndex: this.groupIndex,
      nextChessPos: this.pos
    }
    updates["/stage/" + global_roomID + "/syncChess/"] = setObject;
    // updates["/stage/" + global_roomID + "/syncChess/nextPos/"] = this.pos;
    firebase.database().ref().update(updates).then((snapshot) => {
      // _this.layoutCount();
      _this.scene.StageManager.finMove();
    });
    // let DB_syncChess = firebase.database().ref("/stage/" + global_roomID + "/syncChess/");
    // firebase.database().ref("/stage/" + global_roomID + "/syncChess/").set({
    //   groupIndex: _this.groupIndex
    // }).then((snapshot) => {
    //   _this.scene.StageManager.finMove();
    //   // _this.moveSyncChess();
    // });  
  }
  /*==============================
  
  ------------------------------*/  
  moveSyncChess(_groupIndex,_pos){
    let chess;
    console.log("moveSyncChess this.pos",_pos)
    console.log("moveSyncChess _groupIndex",_groupIndex)
    let pos = _pos;
    pos.X = 5 - pos.X;
    pos.Y = 7 - pos.Y;
    console.log("moveSyncChess pos",pos)
    if(this.scene.StageManager.STATUS.TURN !== this.scene.PlayerManager.PLAYER_NUMBER){
      chess = this.scene.PlayerManager.player2ChessGroup.children.entries[_groupIndex - 1];
      console.log("chess",chess);
      this.scene.StageManager.moveChess(chess,pos);
    }

  }
}