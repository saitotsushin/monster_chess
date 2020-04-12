
import PlayerData from '../object/PlayerData';
import ChessManager from '../object/ChessManager';
import FooterMenu from '../object/ui/setting/FooterMenu';
import Team from '../object/ui/setting/Team';
import StockChess from '../object/ui/setting/StockChess';
import ChessInfoWindow from '../object/ui/setting/ChessInfoWindow';

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

    this.MAX_COST = 8;
    this.setCost = 0;

    

  }
  create(){

    this.setCost = 0;

    this.registry.list.player1_ChessList = this.teamGroup;

    /*=================
    レイアウト編集
    =================*/
    this.FooterMenu = new FooterMenu({
      scene: this
    });
    this.FooterMenu.create();

    this.Team = new Team({
      scene: this
    });
    this.Team.create();

    this.StockChess = new StockChess({
      scene: this
    });
    this.StockChess.create();

    this.ChessInfoWindow = new ChessInfoWindow({
      scene: this
    });
    this.ChessInfoWindow.create();

    /*背景*/
    this.cameras.main.setBackgroundColor('#eeeeee');

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
      this.teamGroup[this.selectedChess.tileIndex] = 0;
      this.StockChess.updateStockChess();
      this.selectedChess.removeInteractive();
      this.selectedChess.setTexture('spritesheet','chess_shadow');
      /*コストの管理*/
      this.setCost -= this.selectedChess.cost;
      this.Team.costNow.setText(this.setCost);
      // this.registry.list.chessCost = this.setCost;
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
      this.askSetNo();
    },this);
    this.btnReturn.depth = 50;


    /*==============================
    デバッグ
    ==============================*/
    // this.debugText = this.add.text(10, 120, '', { font: '10px Courier', fill: '#000' });
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
      this.ChessInfoWindow.setChessInfo(this.selectedChess)
    }
  }
  /*==============================
  チームの追加パネルをタッチした時
  ------------------------------*/   
  touchAddTile(addTile){

    this.selectedTile = addTile;
    
    this.Cursor.x = addTile.x;
    this.Cursor.y = addTile.y;  

    if(!this.selectedChess){
      return;
    }
    this.selectedChess.tileIndex = addTile.tileIndex;
    if(!this.checkCost('add')){
      return false;
    }

    this.EDIT_CHESS_STATUS = 'SET';
    this.askSet();

  };


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

    this.btnInfo.setVisible(false);


  }
  askSetYes(){
    let teamChessGroup = this.Team.playerTeamChessGroup.children.entries;
    this.EDIT_CHESS_STATUS = "";
    /*ボタンの非表示*/
    this.btnSet.setVisible(false);
    this.btnReturn.setVisible(false);

    this.setCost += this.selectedChess.cost;
    // this.registry.list.chessCost = this.setCost;

    this.Team.costNow.setText(this.setCost);
    

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
        // this.registry.list.chessCost = this.setCost;
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
  showChessInfoWindow(){
    this.ChessInfoWindow.ChessInfoContainer.setVisible(true);
    this.ChessInfoWindow.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }

  hideChessInfoWindow(){
    this.ChessInfoWindow.ChessInfoContainer.setVisible(false);
    this.ChessInfoWindow.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
  }
}

export default SettingScene;
