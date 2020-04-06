
import PlayerData from '../object/PlayerData';
import ChessManager from '../object/ChessManager';
import Chess from '../object/ui/menu/chess';

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

    this.MODE = "INFO";
    this.EDIT_STATUS = "";//CONTINUE or FIN

    this.selectedLayoutChess = "";
    this.MAX_COST = 8;
    this.setCost = 0;

    

  }
  create(){
    this.playerStockChessGroup = this.add.group();
    this.playerTeamChessGroup = this.add.group();
    this.ChessBaseGroup = this.add.group();
    this.StageLayoutTileGroup = this.add.group();
    this.StageLayoutChessGroup = this.add.group();

    this.LayoutContainer = this.add.container(0, 0);
    this.StockChessContainer = this.add.container(0, 0);
    this.StockChessContainer.setVisible(false);
    this.ChessInfoContainer = this.add.container(0, 0);
    this.ChessInfoMoveGroup = this.add.group();

    /*背景*/
    this.cameras.main.setBackgroundColor('#eeeeee');

    /*タイトル：TEAM*/
    this.titleTeam = this.add.bitmapText(
      10,
      12,
      'bitmapFont',
      'TEAM',
      10
    );
    /*==============================
    ボタン：チーム編集
    ------------------------------*/        
    this.btnTeamEdit = this.add.sprite(
      54,
      11,
      'spritesheet',
      'btn_edit'
    );
    this.btnTeamEdit.setInteractive();
    this.btnTeamEdit.setOrigin(0,0);


    this.btnTeamEdit.on('pointerdown', () => {

      if(this.EDIT_STATUS === "CONTINUE"){
        return;
      }else{
        this.EDIT_STATUS = "CONTINUE";
      }
      if(this.MODE === "EDIT"){
        /*------------------------
        編集中
        ------------------------*/
        this.MODE = "INFO";
        this.EDIT_STATUS = "";
        this.btnTeamEdit.setTexture('spritesheet','btn_edit');
        this.hideStockChess();
        this.showLayoutTile();
        this.StockChessContainer.setVisible(false);
        this.LayoutContainer.setVisible(true);
      }else{
        /*------------------------
        編集前
        ------------------------*/
        this.MODE = "EDIT";
        this.btnTeamEdit.setTexture('spritesheet','btn_edit_fin');
        this.showStockChess();
        this.hideLayoutTile();
        this.StockChessContainer.setVisible(true);
        this.LayoutContainer.setVisible(false);        
      }
    },this); 

    /*==============================
    レイアウト編集エリア
    ------------------------------*/
    /*タイトル：lAYOUT*/
    this.titleLayout = this.add.bitmapText(
      10,
      55,
      'bitmapFont',
      'LAYOUT',
      10
    );    
    /*ボタン：レイアウト編集*/
    this.btnLayoutEdit = this.add.sprite(
      90,
      60,
      'spritesheet',
      'btn_edit'
    );

    this.btnLayoutEdit.setInteractive();
    
    this.btnLayoutEdit.on('pointerdown', () => {
     
      if(this.EDIT_STATUS !== 'FIN'){
        return;
      }
      if(this.MODE !== "LAYOUT"){
        this.MODE = "LAYOUT";
        this.setLayoutGroup();
        this.setLayoutChessToStage(); 
        this.btnLayoutEdit.setTexture('spritesheet','btn_edit_fin');
      }else{
        this.setStageArr();
        this.btnLayoutEdit.setTexture('spritesheet','btn_edit');
      }

    },this); 
    this.LayoutContainer.add(
      [
        this.btnLayoutEdit,
        this.titleLayout
      ]
    );
    /*=================
    レイアウト編集
    =================*/
    this.layoutedChesses = [
      "chess_1",
      "chess_2",
      "chess_3",
    ];

    /*==============================
    フッター
    メニューボタン：メニュー
    ------------------------------*/        
    this.btnMenu1 = this.add.sprite(
      3,
      172,
      'spritesheet',
      'btn_menu'
    );
    this.btnMenu1.setInteractive();
    this.btnMenu1.on('pointerdown', () => {
      this.scene.start('MenuScene');
    },this);
    this.btnMenu1.setOrigin(0,0);

    /*メニューボタン：チーム＆レイアウト*/
    this.btnTeamLayout = this.add.sprite(
      28,
      172,
      'spritesheet',
      'btn_team_layout'
    );
    this.btnTeamLayout.setInteractive();
    this.btnTeamLayout.on('pointerdown', () => {
      this.scene.start('MenuScene');
    },this);
    this.btnTeamLayout.setOrigin(0,0);

    /*メニューボタン：チェス情報*/
    this.btnChessInfo = this.add.sprite(
      88,
      172,
      'spritesheet',
      'btn_chess_info'
    );
    this.btnChessInfo.setInteractive();
    this.btnChessInfo.on('pointerdown', () => {
      this.scene.start('MenuScene');
    },this);
    this.btnChessInfo.setOrigin(0,0);

    /*=================
    レイアウト編集
    =================*/
    this.textCost = this.add.text(
      100,
      100,
      'コスト:'+this.setCost+'/'+this.MAX_COST,
      { font: '10px Courier', fill: '#CCC' }
    );
    
    /*=================
    ストックしているチェス
    =================*/
    /*タイトル：TEAM*/
    this.titleStockChess = this.add.bitmapText(
      10,
      55,
      'bitmapFont',
      'STOCK CHESS',
      10
    );
    this.StockChessContainer.add(
      [
        this.titleStockChess
      ]
    );
    /*=================
    チェスのインフォメーション
    -------------------*/
    /*チェスのウィンドウ
    -------------------*/
    this.ChessInfoWindow = this.add.sprite(
      10,
      90,
      'spritesheet',
      'window_info_L'
    );
    this.ChessInfoWindow.setOrigin(0,0);
    /* チェスのウィンドウクローズ
    -------------------*/
    this.btnChessInfoWindowClose = this.add.sprite(
      102,
      94,
      'spritesheet',
      'btn_close'
    );
    this.btnChessInfoWindowClose.setInteractive();
    this.btnChessInfoWindowClose.on('pointerdown', () => {
      this.hideChessInfoWindow();
    }); 
    this.chessInfoImage = this.add.sprite(
      55,
      111,
      'spritesheet',
      'chess_1'
    );
    this.chessInfoImage.scaleX = 2;
    this.chessInfoImage.scaleY = 2;
    this.chessInfoNumb = this.add.bitmapText(
      14,
      113,
      'bitmapFont',
      '00',
      10
    );
    this.chessInfoNumb.setLetterSpacing = 2;
    this.chessInfoHp = this.add.bitmapText(
      70,
      139,
      'bitmapFont',
      '00',
      10
    );
    this.chessInfoHp.setOrigin(1).setRightAlign();
    this.chessInfoAttack = this.add.bitmapText(
      70,
      151,
      'bitmapFont',
      '000',
      10
    );
    this.chessInfoAttack.setOrigin(1).setRightAlign();
    this.chessInfoDifence = this.add.bitmapText(
      70,
      163,
      'bitmapFont',
      '000',
      10
    );
    this.chessInfoDifence.setOrigin(1).setRightAlign();
    this.ChessInfoContainer.add(
      [
        this.ChessInfoWindow,
        this.btnChessInfoWindowClose,
        this.chessInfoNumb,
        this.chessInfoHp,
        this.chessInfoAttack,
        this.chessInfoDifence,
        this.chessInfoImage
      ]
    );
    for(var i = 0; i < 8;i++){
      for(var k = 0; k < 6; k++){

        let sprite = this.add.sprite(
          k * 5 + 91 + k,
          i * 5 + 118 + i,
          'spritesheet',
          'movearea_s_default'
        );
        sprite.depth = 105;

        this.ChessInfoMoveGroup.add(sprite);

      }
    }
    

    // this.ChessInfoContainer.setVisible(false);
    this.ChessInfoContainer.depth = 100;

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
    this.btnDelete.setVisible(false);
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


    /*==============================
    デバッグ
    ==============================*/
    // this.debugText = this.add.text(10, 10, '', { font: '10px Courier', fill: '#FFFFFF' });
    // this.debugText.depth = 100;
    // this.debugText.setScrollFactor(0,0);
    // this.debugText.alpha = 0.8;    
    this.setTeamChessGroup();
    this.setStockChessGroup();
    this.setLayoutGroup();
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
  所有しているチェスたち
  ------------------------------*/   
  setTeamChessGroup(){
    let chessDataList = this.ChessManager.ChessData.chessList;
    let playerChessList;
    let group;
    let sprite;
    playerChessList = this.PlayerData.player1_ChessList;
    group = this.playerTeamChessGroup;

    for(var i = 0; i < playerChessList.length; i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          
          sprite = new Chess({
            scene: this,
            x: i * 20 + 20,
            y: 40,
            frame: item.key,
            key: 'spritesheet'
          });

          sprite.cost = item.cost;
          sprite.no = item.no;
          sprite.type = "team";

          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;

          sprite.status = item.status;

          sprite.depth = 12;

          sprite.name = item.key;

          sprite.setted = false;


          group.add(sprite);
          let base = this.add.sprite(
            i * 20 + 20,
            40,
            'spritesheet',
            'panel_add_team_1'
          );

        }

      },this);

    }

  }
  /*==============================
  所有しているチェスたち
  ------------------------------*/   
  setStockChessGroup(){
    let chessDataList = this.ChessManager.ChessData.chessList;
    let sprite;
    let playerChessList = this.PlayerData.stockChesses;
    let teamChessList = this.PlayerData.player1_ChessList;
    let group = this.playerStockChessGroup;
    /*レイアウトの設定周り START*/
    let baseHeight = 82;
    let addHeight = 20;
    let n = 0;
    let tileX = 0;
    let tileY = 0;
    let panel = "";
    /*レイアウトの設定周り END*/

    for(var i = 0; i < playerChessList.length; i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          /*レイアウトの設定周り START*/
          if(i % 6 === 0 && i !== 0){
            baseHeight += addHeight;
            tileX = 0;
            tileY++;
          }
          if(5 < i && i < 12){
            if(i % 2 === 1){
              panel = "panel_layout_2";
            }else{
              panel = "panel_layout_1";
            }
          }else{
            if(i % 2 === 1){
              panel = "panel_layout_1";
            }else{
              panel = "panel_layout_2";
            }
          }
          /*レイアウトの設定周り END*/
    
          
          sprite = new Chess({
            scene: this,
            x: tileX * addHeight + 20,
            y: baseHeight,
            frame: item.key,
            key: 'spritesheet'
          });

          /*すでにチームに設定されていたら押せない*/
          if (teamChessList.indexOf(item.key) >= 0){
            sprite.alpha = 0.4;
            sprite.isTeam = true;
          }
          

          sprite.cost = item.cost;
          sprite.no = item.no;

          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;

          sprite.status = item.status;

          sprite.type = "stock";
          
          sprite.areaMapBase = sprite.mergeArea(
            sprite.moveAreaMapBase,
            sprite.attackAreaMapBase,
            sprite.areaMapBase
          );

          sprite.depth = 12;

          sprite.name = item.key;

          sprite.setted = false;


          group.add(sprite);

          // let panel_add_team = '';
          // if(i % 2 === 1){
          //   panel_add_team = 'panel_add_team_1'
          // }else{
          //   panel_add_team = 'panel_add_team_2'
          // }

          let base = this.add.sprite(
            tileX * addHeight + 20,
            baseHeight,
            'spritesheet',
            panel
          );
          base.depth = 8;

          this.ChessBaseGroup.add(base);

          tileX++;

        }

      },this);

    }
    this.hideStockChess();

  }
  /*==============================
  チームのチェスをタッチした時
  ------------------------------*/   
  touchChess(chess){
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
      this.setChessInfo(this.selectedChess)
    }

    // sprite.tileIndex = -1;
    // this.selectedChess.tileIndex = -1;
  }

  touchAddTile(addTile){
    if(!this.selectedChess){
      return;
    }
    if(this.selectedChess.setted){
      this.teamGroup[this.selectedChess.tileIndex] = 0;
    }
    this.selectedChess.tileIndex = addTile.tileIndex;
    if(!this.checkCost('add')){
      return false;
    }
    this.selectedChess.setted = true;
    this.selectedChess.x = addTile.x;
    this.selectedChess.y = addTile.y;
    this.teamGroup[addTile.tileIndex] = this.selectedChess.name;
    this.checkEditFin();

  };
  checkCost(mode){
    let checkCost = this.selectedChess.cost;
    let nowCost = this.setCost;

    if(mode === 'remove'){
      if(this.selectedChess.setted === true){
        this.setCost -= this.selectedChess.cost;
      }
    }
    if(mode === 'add'){
      if(checkCost + nowCost > this.MAX_COST){
        console.log("コストオーバー");
        return false;
      }      
      this.setCost += this.selectedChess.cost;
    }
    
    
    this.textCost.setText('コスト:'+this.setCost+'/'+this.MAX_COST);

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
      this.btnTeamEdit.setText('(編集完了？)');
      this.EDIT_STATUS = "FIN";
    }else{
      this.btnTeamEdit.setText('(編集中)');
      this.EDIT_STATUS = "CONTINUE";
    }
    this.registry.list.player1_ChessList = this.teamGroup;
  }

  setLayoutGroup(){
    let baseHeight = 82;
    let addHeight = 20;
    let n = 0;
    let tileX = 0;
    let tileY = 0;
    let panel = "";

    for(var i = 0; i < 18; i++){
      if(i % 6 === 0 && i !== 0){
        baseHeight += addHeight;
        tileX = 0;
        tileY++;
      }
      if(5 < i && i < 12){
        if(i % 2 === 1){
          panel = "panel_layout_2";
        }else{
          panel = "panel_layout_1";
        }
      }else{
        if(i % 2 === 1){
          panel = "panel_layout_1";
        }else{
          panel = "panel_layout_2";
        }
      }
      let sprite = this.add.sprite(
        tileX * addHeight + 20,
        baseHeight,
        'spritesheet',
        panel
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

    this.selectedLayoutChess = layoutChess;

  }
  touchLayoutTile(layoutTile){
    if(this.selectedLayoutChess){
      this.selectedLayoutChess.x = layoutTile.x;
      this.selectedLayoutChess.y = layoutTile.y;
      this.selectedLayoutChess.tilePos = layoutTile.tilePos;
    }
  }
  /*==============================
  表示・非表示
  ------------------------------*/   
  /*ストックの駒
  ------------------------------*/
  showStockChess(){
    this.playerStockChessGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
    this.ChessBaseGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }

  hideStockChess(){
    this.playerStockChessGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
    this.ChessBaseGroup.children.entries.forEach(
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
    this.StageLayoutTileGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }
  hideLayoutTile(){
    this.StageLayoutTileGroup.children.entries.forEach(
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
    this.ChessInfoContainer.setVisible(true);
    this.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }

  hideChessInfoWindow(){
    this.ChessInfoContainer.setVisible(false);
    this.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
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
        stageArr[sprite.tilePos.Y][sprite.tilePos.X] = index + 1;
      }
    );
    
    this.registry.list.player1Auto_Arr = stageArr;
  }
  /*==============================
  チェスの情報をセット
  ==============================*/
  setChessInfo(chess){
    this.chessInfoNumb.setText(chess.no);
    this.chessInfoHp.setText(chess.status.maxHp);
    this.chessInfoAttack.setText(chess.status.power);
    this.chessInfoDifence.setText(chess.status.difence);
    this.chessInfoImage.setTexture('spritesheet',chess.frame.name);
    this.getAreaMap(3,4,chess)

  }

  getAreaMap(X,Y,target){


    let base1 = target.areaMapBase;
    let base = [];
    if(target.playerType === "player2"){
      base = base1.slice().reverse();
    }else{
      base = base1;
    }
    let moveArea = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    let harfHeight = (base.length - 1) / 2;
    let harfWidth = (base[0].length - 1) / 2;
    let baseY = harfHeight - Y;
    let baseX = harfWidth - X;
    let i2 = 0;
    let k2 = 0;
    let centePos = {
      X: 0,
      Y: 0
    }

    let groupCount = 0;
    let ChessInfoMoveGroup = this.ChessInfoMoveGroup.children.entries;

    /*初期化*/
    for(var i = baseY; i < harfHeight + baseY + 1; i++){//縦（y）
      for(var k = baseX; k < harfWidth + baseX + 1; k++){//横（x）
        if(base[i][k] === 1){//移動
          moveArea[i2][k2] = base[i][k];
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_move');
        }
        if(base[i][k] === 2){//攻撃
          moveArea[i2][k2] = base[i][k];
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_attack');
        }
        if(base[i][k] === 3){//移動＆攻撃
          moveArea[i2][k2] = base[i][k];
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_move_attack');
        }
        if(base[i][k] === 9){
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_chess');
        }
        if(base[i][k] === 0){
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_default');
        }
        k2++;
        groupCount++;
      }
      k2 = 0;
      i2++;
    }
    
  }
}

export default SettingScene;
