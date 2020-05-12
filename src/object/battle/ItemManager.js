// import * as StageFunc from '../object/StageFunc';
import itemData from './itemData';
import * as Prop      from './stage/FunctionStageProp';
import ModalItemSet from './ui/modal/ModalItemSet';

export default class itemManager{
  constructor(config) {

    this.scene = config.scene;
    
    this.itemPlayer1Group = config.scene.add.group();
    this.itemPlayer2Group = config.scene.add.group();
    this.itemBaseGroup = this.scene.add.group();

    this.itemData = new itemData({
      scene: this.scene
    });

    this.itemSetCount = 0;

    this.createitem("player1");
    this.createitem("player2");

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
  createitem(mode){
    let playeritemList;
    let bombHeight = 0;
    let itemGroup;
    if(mode === "player1"){
      playeritemList = this.itemData.player1_itemList;
      bombHeight = 182;
      itemGroup = this.itemPlayer1Group;
    }
    if(mode === "player2"){
      playeritemList = this.itemData.player2_itemList;
      bombHeight = 10;
      itemGroup = this.itemPlayer2Group;
    }
    let itemList = this.itemData.itemList;
    let sprite;
    /*================
    トラップの設置
    ================*/
    for(var i = 0; i < playeritemList.length;i++){
      // frame: item.key,
      // key: 'spritesheet'
      itemList.filter(function(item, index){
        if(item.key === playeritemList[i]){
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
          sprite.pos = {
            X: 0,
            Y: 0
          }
          sprite.depth = 120;
          sprite.setted = false;
          itemGroup.add(sprite);
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

        this.itemBaseGroup.add(sprite)
    
      }
    }

  }
  setitemByRandom(){
    /*配置するか */
    var random = Math.random();
    if(random < 0.4){
      //40%未満で実行する
    }else{
      return;
    }
    let itemList;
    let playerChessGroup = this.scene.PlayerManager.player2ChessGroup.children.entries;
    let randomChessIndex =  Math.floor( Math.random() * (playerChessGroup.length - 1 + 1) ) + 0;
    let selectedChess = playerChessGroup[randomChessIndex];
    let chessPos = selectedChess.pos;

    if(this.scene.StageManager.STATUS.TURN === "player2"){
      itemList = this.itemPlayer2Group.children.entries;
    }
    if(itemList.length > 0){

      let randomIndex =  Math.floor( Math.random() * (itemList.length - 1 + 1) ) + 0;
      let selecteditem = itemList[randomIndex];
      if(selecteditem.configured === true){
        return;
      }
      let tile = this.scene.StageManager.tilePropMap[chessPos.Y][chessPos.X];
      if(tile.item){
        return;
      }

      //設定済みにする。
      selecteditem.configured = true;
      //どのプレイヤーが設置したか。
      selecteditem.configuredPlayer = this.scene.StageManager.STATUS.TURN;

      let config = {
        scene: this.scene,
        selecteditem: selecteditem,
        index: randomIndex,
        nextPos: {
          X: chessPos.X,
          Y: chessPos.Y
        }
      }
      Prop.setPropitem(config);
    }else{
      return;
    }

  }
}
  