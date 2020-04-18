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
  
  }
  create(){
    this.db = firebase.database();
    global_DB = this.db;

    Firebase.getStart(this.db,this);
  }
  goGameScene(){
    // this.registry.list.ref = _ref;
    this.registry.list.gameMode = 'NET';
    this.scene.start('GameScene');
  }
  
}

export default RoomScene;
