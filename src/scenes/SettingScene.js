
import PlayerData from '../object/PlayerData';
import ChessManager from '../object/ChessManager';
import Chess from '../object/ui/menu/Chess';
import FooterMenu from '../object/ui/setting/FooterMenu';
import Layout from '../object/ui/setting/Layout';
import Team from '../object/ui/setting/Team';
import StockChess from '../object/ui/setting/StockChess';

class SettingScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'SettingScene'
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
    this.teamGroup = this.PlayerData.player1_ChessList;

    this.MODE = "INFO";
    this.EDIT_STATUS = "";//CONTINUE or FIN
    this.EDIT_CHESS_STATUS = "";

    this.selectedLayoutChess = "";
    this.MAX_COST = 8;
    this.setCost = 0;

    

  }
  create(){
    /*=================
    レイアウト編集
    =================*/
    this.textCost = this.add.text(
      10,
      140,
      'コスト:'+this.setCost+'/'+this.MAX_COST,
      { font: '10px Courier', fill: '#CCC' }
    );
    this.FooterMenu = new FooterMenu({
      scene: this
    });
    this.Layout = new Layout({
      scene: this
    });
    this.Layout.create();

    this.Team = new Team({
      scene: this
    });
    this.Team.create();

    this.StockChess = new StockChess({
      scene: this
    });
    this.StockChess.create();


    // this.ChessInfoContainer = this.add.container(0, 0);
    // this.ChessInfoMoveGroup = this.add.group();

    /*背景*/
    this.cameras.main.setBackgroundColor('#eeeeee');

    /*=================
    レイアウト編集
    =================*/
    this.layoutedChesses = [
      "chess_1",
      "chess_2",
      "chess_3",
    ];

    /*=================
    カーソル
    =================*/
    this.Cursor = this.add.sprite(
      20,
      40,
      'spritesheet',
      'cursor'
    );
    this.Cursor.setVisible(false);
    this.Cursor.depth = 50;

    /*=================
    デリートボタン
    =================*/
    this.btnDelete = this.add.sprite(
      20,
      40,
      'spritesheet',
      'btn_delete'
    );
    this.btnDelete.setInteractive();
    this.btnDelete.setVisible(false);
    this.btnDelete.on('pointerdown', () => {
      // let teamChessGroup = this.Team.playerTeamChessGroup.children.entries;
      this.setCost -= this.selectedChess.cost;
      this.teamGroup[this.selectedChess.tileIndex] = 0;
      this.StockChess.updateStockChess();
      this.selectedChess.removeInteractive();

      // console.log("this.selectedChess",this.selectedChess)

      this.selectedChess.setTexture('spritesheet','chess_shadow');
      this.textCost.setText('コスト:'+this.setCost+'/'+this.MAX_COST);
      this.btnDelete.setVisible(false);
    },this);

    /*=================
    インフォをみるボタン
    =================*/
    this.btnInfo = this.add.sprite(
      20,
      40,
      'spritesheet',
      'btn_info'
    );
    this.btnInfo.setVisible(false);
    this.btnInfo.setInteractive();
    this.btnInfo.on('pointerdown', () => {
      this.showChessInfoWindow();
    },this);
    this.btnInfo.depth = 50;

    /*=================
    仮置き。設置するか確認用
    =================*/
    // this.shadowChess = this.add.sprite(
    //   20,
    //   40,
    //   'spritesheet',
    //   'chess_1'
    // );
    // this.shadowChess.setVisible(false);
    this.btnInfo.depth = 50;
    /*=================
    チェスの設置ボタン：決定
    =================*/
    this.btnSet = this.add.sprite(
      20,
      40,
      'spritesheet',
      'btn_set'
    );
    this.btnSet.setVisible(false);
    this.btnSet.setInteractive();
    this.btnSet.on('pointerdown', () => {
      // this.showChessInfoWindow();
      this.askSetYes();
    },this);
    this.btnSet.depth = 50;
    /*=================
    チェスの設置ボタン：戻す
    =================*/
    this.btnReturn = this.add.sprite(
      20,
      40,
      'spritesheet',
      'btn_return'
    );
    this.btnReturn.setVisible(false);
    this.btnReturn.setInteractive();
    this.btnReturn.on('pointerdown', () => {
      // this.showChessInfoWindow();
      this.askSetNo();
    },this);
    this.btnReturn.depth = 50;


    /*==============================
    デバッグ
    ==============================*/
    // this.debugText = this.add.text(10, 10, '', { font: '10px Courier', fill: '#FFFFFF' });
    // this.debugText.depth = 100;
    // this.debugText.setScrollFactor(0,0);
    // this.debugText.alpha = 0.8;    
    // this.setTeamChessGroup();
    // this.setStockChessGroup();
    /*------------------------------
    デバッグ END
    ==============================*/

    this.hideChessInfoWindow();

  }
  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    // this.debugText.setText(
    //   [
    //     'EDIT_STATUS :'+this.EDIT_STATUS,
    //     'MODE        :'+this.MODE,
    //   ]
    // );

    /*------------------------------
    デバッグ END
    ==============================*/
  }

  /*==============================
  チームのチェスをタッチした時
  ------------------------------*/   
  touchChess(chess){
    console.log("touchChess")
    /*チームへの追加パネルをタッチ中。決定or戻すのウインドウ表示中*/
    if(this.EDIT_CHESS_STATUS === 'SET'){
      return;      
    }
    this.selectedChess = chess;
    this.Cursor.x = this.selectedChess.x;
    this.Cursor.y = this.selectedChess.y;  

    if(chess.type === 'team'){
      this.btnDelete.setVisible(true);
      this.btnInfo.setVisible(false); 
      this.btnDelete.x = this.selectedChess.x;
      this.btnDelete.y = this.selectedChess.y + this.selectedChess.height;
      this.Cursor.setVisible(true);
    }

    if(chess.type === "stock"){
      this.btnDelete.setVisible(false);     
      this.btnInfo.setVisible(true); 
      this.btnInfo.x = this.selectedChess.x;
      this.btnInfo.y = this.selectedChess.y + this.selectedChess.height;
      this.StockChess.ChessInfoWindow.setChessInfo(this.selectedChess)
    }
  }
  /*==============================
  チームの追加パネルをタッチした時
  ------------------------------*/   
  touchAddTile(addTile){
    console.log("touchAddTile")

    this.selectedTile = addTile;
    
    this.Cursor.x = addTile.x;
    this.Cursor.y = addTile.y;  

    if(!this.selectedChess){
      return;
    }
    // if(this.selectedChess.setted){
    //   this.teamGroup[this.selectedChess.tileIndex] = 0;
    // }
    this.selectedChess.tileIndex = addTile.tileIndex;
    if(!this.checkCost('add')){
      return false;
    }

    this.EDIT_CHESS_STATUS = 'SET';
    this.askSet();

  };
  touchLayoutChess(layoutChess){

    this.selectedLayoutChess = layoutChess;

  }
  touchLayoutTile(layoutTile){
    if(this.selectedLayoutChess){
      this.selectedLayoutChess.x = layoutTile.x;
      this.selectedLayoutChess.y = layoutTile.y;
      this.selectedLayoutChess.tilePos = layoutTile.tilePos;
    }
  }

  askSet(){

    let teamChessGroup = this.Team.playerTeamChessGroup.children.entries;

    this.btnSet.setVisible(true);
    this.btnSet.x = this.selectedTile.x;
    this.btnSet.y = this.selectedTile.y - this.selectedChess.height;

    this.btnReturn.setVisible(true);
    this.btnReturn.x = this.selectedTile.x;
    this.btnReturn.y = this.selectedTile.y + this.selectedChess.height;

    this.selectedChess.alpha = 0.4;

    let chengeTexture = this.selectedChess.frame.name;
    teamChessGroup[this.selectedTile.tileIndex].setTexture('spritesheet',chengeTexture);

    // this.shadowChess.x = this.selectedTile.x;
    // this.shadowChess.y = this.selectedTile.y;

    // this.shadowChess.setVisible(true);
    this.btnInfo.setVisible(false);


  }
  askSetYes(){
    let teamChessGroup = this.Team.playerTeamChessGroup.children.entries;
    this.EDIT_CHESS_STATUS = "";
    /*ボタンの非表示*/
    this.btnSet.setVisible(false);
    this.btnReturn.setVisible(false);

    this.setCost += this.selectedChess.cost;
    
    this.textCost.setText('コスト:'+this.setCost+'/'+this.MAX_COST);


    this.teamGroup[this.selectedTile.tileIndex] = this.selectedChess.name;
    this.StockChess.updateStockChess();
    teamChessGroup[this.selectedTile.tileIndex].setTexture('spritesheet',this.selectedChess.frame.name);
    teamChessGroup[this.selectedTile.tileIndex].setInteractive();
    this.checkEditFin();

  }
  askSetNo(){
    this.EDIT_CHESS_STATUS = "";
    let teamChessGroup = this.Team.playerTeamChessGroup.children.entries;
    teamChessGroup[this.selectedTile.tileIndex].setTexture('spritesheet','chess_shadow');
    teamChessGroup[this.selectedTile.tileIndex].removeInteractive();
    this.btnSet.setVisible(false);
    this.btnReturn.setVisible(false);
    // this.shadowChess.setVisible(false);
    this.selectedChess.alpha = 1;

  }
  checkCost(mode){
    let checkCost = this.selectedChess.cost;
    let nowCost = this.setCost;

    if(mode === 'remove'){
      // if(this.selectedChess.setted === true){
        this.setCost -= this.selectedChess.cost;
      // }
    }
    if(mode === 'add'){
      if(checkCost + nowCost > this.MAX_COST){
        console.log("コストオーバー");
        return false;
      }      
      
    }

    return true;

  }
  checkEditFin(){
    
    let fin_count = 0;
    for(var i = 0; i < this.teamGroup.length; i++){
      if(this.teamGroup[i] !== 0){
        fin_count++;
        
      }
    }
    
    
    if(fin_count === this.teamGroup.length){
      // this.btnTeamEdit.setText('(編集完了？)');
      this.EDIT_STATUS = "FIN";
      this.Team.btnTeamEdit.alpha = 1;
    }else{
      // this.btnTeamEdit.setText('(編集中)');
      this.EDIT_STATUS = "CONTINUE";
      this.Team.btnTeamEdit.alpha = 0.4;
    }
    this.registry.list.player1_ChessList = this.teamGroup;
  }


  /*==============================
  表示・非表示
  ------------------------------*/   
  /*ストックの駒
  ------------------------------*/
  showStockChess(){
    this.StockChess.StockChessContainer.setVisible(true);
    this.Layout.LayoutContainer.setVisible(false);    
    this.StockChess.playerStockChessGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
    this.StockChess.ChessBaseGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }

  hideStockChess(){
    this.Layout.LayoutContainer.setVisible(true);
    this.StockChess.StockChessContainer.setVisible(false);
    this.StockChess.playerStockChessGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
    this.StockChess.ChessBaseGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
  }
  /*==============================
  表示・非表示
  ------------------------------*/   
  /*レイアウト用のタイル
  ------------------------------*/
  showLayoutTile(){
    this.Layout.StageLayoutTileGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }
  hideLayoutTile(){
    this.Layout.StageLayoutTileGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
  }
  /*==============================
  表示・非表示
  ------------------------------*/   
  /*ストックの駒
  ------------------------------*/
  showChessInfoWindow(){
    this.StockChess.ChessInfoWindow.ChessInfoContainer.setVisible(true);
    this.StockChess.ChessInfoWindow.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }

  hideChessInfoWindow(){
    this.StockChess.ChessInfoWindow.ChessInfoContainer.setVisible(false);
    this.StockChess.ChessInfoWindow.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
  }
  /*==============================
  共通関数
  ==============================*/
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
        stageArr[sprite.tilePos.Y][sprite.tilePos.X] = index + 1;
      }
    );
    
    this.registry.list.player1Auto_Arr = stageArr;
  }
}

export default SettingScene;
