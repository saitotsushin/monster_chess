import firebase from 'firebase/app';
// import firebase = require("firebase/app");
import 'firebase/auth';
import 'firebase/database';

/*==============
関数のスコープ内で使う変数
==============*/
let DB;
let guestCheck;
let roomData;
let ref;
let UID;
let scene;

/*=================
room用のランダムな値を取得
https://pgmemo.tokyo/data/archives/497.html
=================*/
export function create_privateid( n ){
  var CODE_TABLE = "0123456789"
    + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    + "abcdefghijklmnopqrstuvwxyz";
  var r = "";
  for (var i = 0, k = CODE_TABLE.length; i < n; i++){
    r += CODE_TABLE.charAt(Math.floor(k * Math.random()));
  }
  return r;
}
export async function getStart(_db,_scene){
  DB = _db;
  scene = _scene;
  getUserID();
};

/*====================
匿名のユーザーを取得
====================*/
export function getUserID(){
  /*====================
  匿名のユーザーを取得のエラーハンドリング
  ====================*/
  firebase.auth().signInAnonymously().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  }); 
  // let getUID;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      UID = user.uid;
      createRoom();
    }
  });
}


/*====================
部屋の検索→あり：入る/なし：作成
====================*/
export function createRoom(){

  /*--------------
  自分が作った部屋は削除する？
  --------------*/

  /*空いている部屋の検索*/
  let roomCheck = DB.ref("stage/");
  
  roomCheck.once('value', function(snapshot) {
    roomData = snapshot.val();
    if(!roomData){
      /*部屋が1つもないとき*/
      setRoom();
      return;
    }else{
      /*自分が作った部屋は削除する*/
      /*TODO*/
      DB.ref('stage/')
      .orderByChild('guest').startAt('').endAt('').limitToFirst(1)
      .once('value',function(snapshot) {
        guestCheck = snapshot.val();
        setRoom();
      });
    }
  });

}

/*====================
匿名のユーザーを取得
====================*/
export function setRoom(){

  let roomId;
    
  /*部屋がなかったら新規作成*/
  if(!guestCheck){
    roomId = create_privateid(8);//8桁の乱数
    
    //DB参照
    ref = DB.ref("/stage/" + roomId);
    let snapshot = ref.once("value");

    var newPostKey = firebase.database().ref().child('stage').push().key;
    var updates = {};
    updates['/stage/' + newPostKey] = roomId;
    ref.set({
      host: UID,
      guest: "",
      turn: "player1",
      layout: 0,
      syncMoveChess: {
        groupIndex: "",
        nextPosX: 0,
        nextPosY: 0,
        player: ""
      },
      syncAttackChess:{
        groupIndex: "",
        attackPoint: 0,
        condition: "",
        mode: "",
        player: ""
      },
      player1:{
        group: [],
        stage: {
          row1: [0,0,0,0,0,0],
          row2: [0,0,0,0,0,0],
          row3: [0,0,0,0,0,0]
        }
      },
      player2:{
        group: [],
        stage: {
          row1: [0,0,0,0,0,0],
          row2: [0,0,0,0,0,0],
          row3: [0,0,0,0,0,0]
        }
      }
    });
    let room = DB.ref("/stage/" + roomId);
    global_roomID = roomId;
    // scene.registry.list.room = room;
    room.on('child_changed', function(data) {
      console.info("guestが見つかりました。");
      room.off();//リスナーのデタッチ、コールバックを削除
      scene.goGameScene();
    });
    // ref.on('child_changed', function(data) {
    //   console.info("guestが来ました。");
    //   scene.goGameScene(ref);
    // });
  }else{
    /*部屋があったらguestに自分のIDを設定*/
    ref = DB.ref("/stage/" + Object.keys(guestCheck)[0]+"/guest/");
    ref.set(UID);
    global_roomID = Object.keys(guestCheck)[0];
    
    scene.goGameScene();
  }

}