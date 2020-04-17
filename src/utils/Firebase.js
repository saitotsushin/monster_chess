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
      // var isAnonymous = user.isAnonymous;
      console.log("onAuthStateChanged")
      console.log("user.uid",user.uid)

      // getUID = user.uid;
      UID = user.uid;
      createRoom();
      // return user.uid;
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
  /*自分のUID*/
  console.log("createRoom uid",firebase.auth().currentUser)

  /*空いている部屋の検索*/
  let roomCheck = DB.ref("stage/");
  
  roomCheck.once('value', function(snapshot) {
    roomData = snapshot.val();
    if(!roomData){
      /*部屋が1つもないとき*/
      console.log("部屋が1つもないとき")
      setRoom();
      return;
    }else{
      /*guestが空の部屋を検索*/
      console.log("guestが空の部屋を検索")
      /*自分が作った部屋は削除する*/
      // DB.ref('stage/')
      // .orderByChild('guest').startAt('').endAt('').limitToFirst(1)
      // .once('value',function(snapshot) {
      //   guestCheck = snapshot.val();
      //   setRoom();
      // });
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

    console.log("部屋がなかったら新規作成")
    roomId = create_privateid(8);//8桁の乱数
    
    //DB参照
    ref = DB.ref("/stage/" + roomId);
    let snapshot = ref.once("value");

    var newPostKey = firebase.database().ref().child('stage').push().key;
    console.log("newPostKey",newPostKey)
    var updates = {};
    updates['/stage/' + newPostKey] = roomId;
    ref.set({
      host: UID,
      guest: "",
      turn: "",
      layout: 0,
      attackPoint: 0,
      player1: {
        ChessGroup: {
          chess1: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess1: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess2: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess3: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess4: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess5: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          }
        },
      },
      player2: {
        ChessGroup: {
          chess1: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess1: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess2: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess3: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess4: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          },
          chess5: {
            key: '',
            hp: 0,
            pos: {
              X: 0,
              Y: 0
            }
          }
        },
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
    // let result = Object.keys(guestCheck);
    console.log("部屋があったらguestに自分のIDを設定")
    ref = DB.ref("/stage/" + Object.keys(guestCheck)[0]+"/guest/");
    ref.set(UID);
    global_roomID = Object.keys(guestCheck)[0];
    // global_room = DB.ref("/stage/" + Object.keys(guestCheck)[0]);
    // scene.registry.list.room = room;
    // scene.registry.list.room.on('child_changed', function(data) {
    //   console.info("データの変更を感知",data);
    // }); 
    scene.goGameScene();
  }

}