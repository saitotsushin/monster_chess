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

    this.watingTimer;
  
  }
  create(){
    this.db = firebase.database();
    global_DB = this.db;

    Firebase.getStart(this.db,this);
    
    /*背景色*/
    this.cameras.main.setBackgroundColor('#FFFFFF');

    /*ページタイトル　オンライン*/
    this.textWait = this.add.bitmapText(
      this.game.config.width/2,
      102,
      'bitmapFont',
      'WAIT...',
      10
    );    
    this.textWait.setOrigin(0.5,0.5);

    var count = 0;

    var _this = this;

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

    
    /*ページタイトル　マッチング*/
    this.textMatch = this.add.bitmapText(
      this.game.config.width/2,
      102,
      'bitmapFontRed',
      'MATCH!',
      10
    );    
    this.textMatch.setOrigin(0.5,0.5);
    this.textMatch.setVisible(false);

    // clearTimeout(id);    

  }
  goGameScene(){
    // this.registry.list.ref = _ref;
    this.registry.list.gameMode = 'NET';
    clearInterval(this.watingTimer);
    this.textWait.setVisible(false);
    this.textMatch.setVisible(true);

    var _this = this;

    var alertmsg = function(){
      clearTimeout(matchTimer);
      _this.scene.start('GameScene');
    }
    
    var matchTimer = setTimeout(alertmsg, 1500);
    
        
    
  }
  
}

export default RoomScene;
