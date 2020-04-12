// import * as StageFunc from '../object/StageFunc';
import TrapData from './TrapData';
import * as Prop      from './stage/FunctionStageProp';
import ModalItemSet from './ui/modal/ModalItemSet';

export default class TrapManager{
  constructor(config) {

    this.scene = config.scene;
    
    this.trapPlayer1Group = config.scene.add.group();
    this.trapPlayer2Group = config.scene.add.group();
    this.trapBaseGroup = this.scene.add.group();

    this.TrapData = new TrapData({
      scene: this.scene
    });

    this.trapSetCount = 0;

    this.createTrap("player1");
    this.createTrap("player2");

    this.create();
  }
  create(){
    this.ModalItemSet = new ModalItemSet({
      scene: this.scene
    });
    /*カーソル*/
    this.Cursor = this.scene.add.sprite(
      20,
      184,
      'spritesheet',
      'cursor_item'
    );
    this.Cursor.depth = 200;
  
    this.Cursor.setInteractive();
    this.Cursor.setVisible(false)
  }
  createTrap(mode){
    let playerTrapList;
    let bombHeight = 0;
    let trapGroup;
    if(mode === "player1"){
      playerTrapList = this.TrapData.player1_TrapList;
      bombHeight = 182;
      trapGroup = this.trapPlayer1Group;
    }
    if(mode === "player2"){
      playerTrapList = this.TrapData.player2_TrapList;
      bombHeight = 10;
      trapGroup = this.trapPlayer2Group;
    }
    let trapList = this.TrapData.trapList;
    let sprite;
    /*================
    トラップの設置
    ================*/
    for(var i = 0; i < playerTrapList.length;i++){
      // frame: item.key,
      // key: 'spritesheet'
      trapList.filter(function(item, index){
        if(item.key === playerTrapList[i]){
          sprite = new item.className({
            scene: this.scene,
            x: i * 20 + 40,
            y: bombHeight,
            key: 'spritesheet',
            frame: item.key,
            groupIndex: i
          });
          if(mode === "player2"){
            sprite.removeInteractive();
            // sprite.alpha = 0;
          }
          sprite.depth = 120;
          sprite.setted = false;
          trapGroup.add(sprite);
        }
      },this);

    }
    /*================
    下地の作成。
    ================*/
    if(mode === "player1"){
      /*ベース */
      for(var i = 0; i < 3;i++){
        let sprite = this.scene.add.sprite(
          i * 20 + 40,
          bombHeight,
          'spritesheet',
          'panel_item'
        );
        sprite.depth = 110;

        this.trapBaseGroup.add(sprite)
    
      }
    }

  }
  setTrapByRandom(){
    /*配置するか */
    var random = Math.random();
    if(random < 0.4){
      //40%未満で実行する
    }else{
      return;
    }
    let trapList;
    let playerChessGroup = this.scene.PlayerManager.player2ChessGroup.children.entries;
    let randomChessIndex =  Math.floor( Math.random() * (playerChessGroup.length - 1 + 1) ) + 0;
    let selectedChess = playerChessGroup[randomChessIndex];
    let chessPos = selectedChess.pos;

    if(this.scene.StageManager.STATUS.TURN === "player2"){
      trapList = this.trapPlayer2Group.children.entries;
    }
    if(trapList.length > 0){

      let randomIndex =  Math.floor( Math.random() * (trapList.length - 1 + 1) ) + 0;
      let selectedTrap = trapList[randomIndex];
      if(selectedTrap.configured === true){
        return;
      }
      let tile = this.scene.StageManager.tilePropMap[chessPos.Y][chessPos.X];
      if(tile.trap){
        return;
      }

      //設定済みにする。
      selectedTrap.configured = true;
      //どのプレイヤーが設置したか。
      selectedTrap.configuredPlayer = this.scene.StageManager.STATUS.TURN;

      let config = {
        scene: this.scene,
        selectedTrap: selectedTrap,
        index: randomIndex,
        nextPos: {
          X: chessPos.X,
          Y: chessPos.Y
        }
      }
      Prop.setPropTrap(config);
    }else{
      return;
    }

  }
  
  // setTrap(){
  //   let selectedTrap = this.scene.Player.selectedTrap;
  //   let k = selectedTrap.x;
  //   let i = selectedTrap.y;
  //   StageFunc.setProperty(
  //     this.scene,
  //     k,
  //     i,
  //     "trap",
  //     selectedTrap.object
  //   );

  //   let setPos = this.scene.stageManager.stageProp.getPositionNumber(k,i);

  //   selectedTrap.object.x = setPos.x;
  //   selectedTrap.object.y = setPos.y;

  //   selectedTrap.object.removeInteractive();

  // }
}
  