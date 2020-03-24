// import ModalManager from '../object/ui/ModalManager';
// import StageManager from '../object/StageManager';
// import TrapManager from '../object/TrapManager';
// import PlayerManager from '../object/PlayerManager';
// import ChessManager from '../object/ChessManager';
import PlayerData from '../object/PlayerData';
import ChessManager from '../object/ChessManager';
import Chess from '../object/ui/menu/chess';

class MenuScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'MenuScene'
    });
    /*プレイヤーデータの読み込み*/
    this.PlayerData = new PlayerData({
      scene: this.scene
    });
    this.ChessManager = new ChessManager({
      scene: this
    });

    this.selectedChess;
    this.selectedTile;

    this.teamGroup = [0,0,0];

    this.MODE = "INFO";
    this.EDIT_STATUS = "";//CONTINUE or FIN

    this.selectedLayoutChess = "";

  }
  create(){
    this.playerChessGroup = this.add.group();
    this.ChessBaseGroup = this.add.group();
    this.StageLayoutTileGroup = this.add.group();
    this.StageLayoutChessGroup = this.add.group();

    this.changeSceneBtn = this.add.text(
      120,
      20,
      '前の画面に戻る',
      { font: '10px Courier', fill: '#CCC' }
    );
    this.changeSceneBtn.depth = 100;

    this.changeSceneBtn.setInteractive();
    
    this.changeSceneBtn.on('pointerdown', () => {
      
      this.scene.start('MainScene');

    },this);  

    /*=================
    レイアウト編集
    =================*/
    this.textTeam = this.add.text(
      20,
      180,
      'チーム',
      { font: '10px Courier', fill: '#CCC' }
    );

    this.btnTeamEdit = this.add.text(
      50,
      180,
      '(編集する)',
      { font: '10px Courier', fill: '#CCC' }
    );    
    this.btnTeamEdit.setInteractive();
    
    this.btnTeamEdit.on('pointerdown', () => {

      if(this.EDIT_STATUS === "CONTINUE"){
        return;
      }else{
        this.EDIT_STATUS = "CONTINUE";
      }
      if(this.MODE === "EDIT"){
        this.MODE = "INFO";
        this.EDIT_STATUS = "";
        this.btnTeamEdit.setText('(編集する)');
      }else{
        this.MODE = "EDIT";
        this.btnTeamEdit.setText('(編集中)');
        
      }

      
    },this); 

    this.setPlayerGroup();
    this.setTeamGroup();

    /*=================
    レイアウト編集
    =================*/
    this.layoutedChesses = [
      "chess_1",
      "chess_2",
      "chess_3",
    ]
    this.btnLayoutEdit = this.add.text(
      120,
      180,
      '(レイアウトする)',
      { font: '10px Courier', fill: '#CCC' }
    );
    this.btnLayoutEdit.alpha = 0.2;
    this.btnLayoutEdit.setInteractive();

    
    this.btnLayoutEdit.on('pointerdown', () => {
     
      if(this.EDIT_STATUS !== 'FIN'){
        return;
      }
      if(this.MODE !== "LAYOUT"){
        this.MODE = "LAYOUT";
        this.setLayoutGroup();
        this.setLayoutChessToStage(); 
        this.btnLayoutEdit.alpha = 1;
        this.btnLayoutEdit.setText('(レイアウト完了？)');
      }else{
        this.setStageArr();
        this.btnLayoutEdit.setText("レイアウトする");
      }

    },this); 
    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.add.text(10, 10, '', { font: '10px Courier', fill: '#FFFFFF' });
    this.debugText.depth = 100;
    this.debugText.setScrollFactor(0,0);
    this.debugText.alpha = 0.8;    
  }
  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    this.debugText.setText(
      [
        'EDIT_STATUS :'+this.EDIT_STATUS,
        'MODE        :'+this.MODE,
      ]
    );

    /*------------------------------
    デバッグ END
    ==============================*/
  }
  setPlayerGroup(){
    let chessDataList = this.ChessManager.ChessData.chessList;
    let playerChessList;
    let group;
    let sprite;
    playerChessList = this.PlayerData.stockChesses;
    group = this.playerChessGroup;

    for(var i = 0; i < playerChessList.length; i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          
          sprite = new Chess({
            scene: this,
            x: i * 30 + 20,
            y: 60,
            key: item.key,
            frame: ''
          });

          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;

          sprite.status = item.status;
          
          sprite.areaMapBase = sprite.mergeArea(
            sprite.moveAreaMapBase,
            sprite.attackAreaMapBase,
            sprite.areaMapBase
          );

          sprite.depth = 12;

          sprite.name = item.key;

          sprite.setted = false;


          group.add(sprite);

          let base = this.add.sprite(
            i * 30 + 20,
            60,
            'add_team_panel'
          );
          base.setInteractive();
          base.depth = 8;
          base.on('pointerdown', () => {
            if(this.MODE === "INFO"){
              return;
            }
            this.touchBaseTile(base);
          }); 
          this.ChessBaseGroup.add(base);

        }

      },this);

    }

  }
  touchChess(chess){
    console.log("touchChess");
    this.selectedChess = chess;
    // sprite.tileIndex = -1;
    // this.selectedChess.tileIndex = -1;
  }

  setTeamGroup(){
    for(var i = 0; i < 3; i++){
      let sprite = this.add.sprite(
        i * 36 + 20,
        120,
        'add_team_panel'
      );
      sprite.setInteractive();
      sprite.depth = 10;
      sprite.tileIndex = i;
      let _this = this;
      sprite.on('pointerdown', () => {
        this.touchAddTile(sprite);
      }); 
    }
  }

  touchBaseTile(baseTile){
    this.selectedChess.x = baseTile.x;
    this.selectedChess.y = baseTile.y;
    if(this.selectedChess.setted === true){
      this.teamGroup[this.selectedChess.tileIndex] = 0;
    }
    this.selectedChess.setted = false;
    console.log("設定：this.teamGroup",this.teamGroup)
    this.checkEditFin();
  }
  touchAddTile(addTile){
    if(!this.selectedChess){
      return;
    }
    if(this.selectedChess.setted){
      this.teamGroup[this.selectedChess.tileIndex] = 0;
    }
    this.selectedChess.tileIndex = addTile.tileIndex;
    this.selectedChess.setted = true;
    this.selectedChess.x = addTile.x;
    this.selectedChess.y = addTile.y;
    this.teamGroup[addTile.tileIndex] = this.selectedChess.name;
    console.log("設定：this.teamGroup",this.teamGroup);
    this.checkEditFin();

  };
  checkEditFin(){
    let fin_count = 0;
    for(var i = 0; i < this.teamGroup.length; i++){
      if(this.teamGroup[i] !== 0){
        fin_count++;
      }
    }
    if(fin_count === this.teamGroup.length){
      this.btnTeamEdit.setText('(編集完了？)');
      this.EDIT_STATUS = "FIN";
    }else{
      this.btnTeamEdit.setText('(編集中)');
      this.EDIT_STATUS = "CONTINUE";
    }
    this.registry.list.player1_ChessList = this.teamGroup;
    console.log("this.EDIT_STATUS",this.EDIT_STATUS)
  }

  setLayoutGroup(){
    let baseHeight = 216;
    let addHeight = 36;
    let n = 0;
    let tileX = 0;
    let tileY = 0;

    for(var i = 0; i < 18; i++){
      if(i % 6 === 0 && i !== 0){
        baseHeight += addHeight;
        tileX = 0;
        tileY++;
      }
      let sprite = this.add.sprite(
        tileX * 36 + 20,
        baseHeight,
        'add_team_panel'
      );
      sprite.setInteractive();
      sprite.depth = 10;
      sprite.tileIndex = i;
      sprite.tilePos = {
        X: tileX,
        Y: tileY + 5
      }
      tileX++;
      let _this = this;
      sprite.on('pointerdown', () => {
        this.touchLayoutTile(sprite);
      });
      this.StageLayoutTileGroup.add(sprite);
    }

  }
  setLayoutChessToStage(){
    let getKey = "";
    this.layoutedChesses = this.teamGroup;
    for(var i = 0; i < this.layoutedChesses.length;i++){
      getKey = this.layoutedChesses[i];
      let sprite = this.add.sprite(
        i * 36 + 20,
        216,
        getKey
      );
      sprite.depth = 20;
      sprite.setInteractive();
      sprite.tilePos = {
        X: i,
        Y: 5
      }
      sprite.on('pointerdown', () => {
        this.touchLayoutChess(sprite);
      }); 
      this.StageLayoutChessGroup.add(sprite)

    }
  }
  touchLayoutChess(layoutChess){

    console.log("touchLayoutChess")

    this.selectedLayoutChess = layoutChess;

  }
  touchLayoutTile(layoutTile){
    console.log("touchLayoutTile")
    if(this.selectedLayoutChess){
      this.selectedLayoutChess.x = layoutTile.x;
      this.selectedLayoutChess.y = layoutTile.y;
      this.selectedLayoutChess.tilePos = layoutTile.tilePos;
    }
  }
  hideLayoutTile(){
    this.StageLayoutTileGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
  }
  showLayoutTile(){
    this.StageLayoutTileGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }
  setStageArr(){
    let stageArr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    this.StageLayoutChessGroup.children.entries.forEach(
      (sprite,index) => {
        console.log("sprite",sprite)
        stageArr[sprite.tilePos.Y][sprite.tilePos.X] = index + 1;
      }
    );
    console.log("stageArr",stageArr)
    
    this.registry.list.player1Auto_Arr = stageArr;
  }
}

export default MenuScene;
