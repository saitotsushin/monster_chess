// import * as firebase from 'firebase';
import firebase from 'firebase/app';
// import firebase = require("firebase/app");
import 'firebase/auth';
import 'firebase/database';
import firebaseConfig from '../firebaseConfig';
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

import * as Firebase from '../utils/Firebase';


class RoomScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'RoomScene'
    });

    this.data = {
      roomId: "",
      id: "",
      ref: {},
      sync: {
        host: "",
        guest: "",
      }    
    };
    this.uid;
    this.db;
    this.roomData;
    this.guestCheck;
    this.roomCheck;  
    this.ref;
    this.roomId;



    // this.create();
    // this.getUserID();
    // this.createRoom();
  
  }
  create(){
    this.db = firebase.database();
    global_DB = this.db;

    Firebase.getStart(this.db,this);
    // console.log("create this.data",this.data)

    // firebase.auth().signInAnonymously().catch(function(error) {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    // });
  }
  goGameScene(){
    // this.registry.list.ref = _ref;
    this.registry.list.gameMode = 'NET';
    this.scene.start('GameScene');
  }
  
}

export default RoomScene;
