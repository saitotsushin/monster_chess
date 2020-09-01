import Chess from '../../ui/menu/Chess';
import ChessData     from '../../../data/ChessData';

export default class Layout{
  constructor(config) {
    this.scene = config.scene;
    this.chessMapData = [];
    this.CreateChessInfo;

    this.iconKing;

    this.chessMoveArea;

    this.chessKingGroupIndex;

    this.isTouchChess = false;

    this.chessCount = 0;

    this.beforeTilePos = {
      X: 0,
      Y: 0
    };
    this.kingPos = {
      X: 0,
    }

  }
  initScene(){

    /*レイアウトデータの読み込み*/
    this.chessLayoutData = this.scene.chessLayoutData;
    this.chessMapData = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ];
    this.chessData = this.scene.registry.list.chessData;
    this.chessDataMaster = this.scene.registry.list.chessDataMaster;

    this.ChessData = new ChessData();

    this.StageLayoutChessGroup = this.scene.add.group();
    this.StageLayoutTileChessGroup = this.scene.add.group();
    this.StageLayoutTileGroup = this.scene.add.group();
    this.StageKingTileGroup = this.scene.add.group();
    
    this.selectedLayoutChess = "";

    /*=================
    カーソル
    =================*/
    this.Cursor = this.scene.add.sprite(
      20,
      40,
      'spritesheet',
      'cursor'
    );
    this.Cursor.setVisible(false);
    this.Cursor.depth = 100;

    /*=================
    レイアウトのコンテナ
    -------------------*/ 
    this.container = this.scene.add.container();
    this.container.x = 0;
    this.container.y = 36;
    this.container.depth = 100; 

    /*=================
    レイアウトのウィンドウ：説明
    -------------------*/
    this.ModalWindow = this.scene.add.sprite(
      this.scene.game.config.width/2,
      0,
      'spritesheet',
      'window_base'
    );
    this.ModalWindowSelectChessText = this.scene.add.text(
      10, 
      -12, 
      ['駒を選んでください。', 'あああ'],
      {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10,
      lineSpacing: 0
     }
    ); 

    /*=================
    レイアウトのウィンドウ：完了
    -------------------*/
    this.ModalWindowFin = this.scene.add.sprite(
      this.scene.game.config.width/2,
      30,
      'spritesheet',
      'window_base'
    );
    this.ModalWindowFinText = this.scene.add.text(
      10, 
      20, 
      ['配置完了？'],
      {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10,
      lineSpacing: 0
     }
    );     
    this.ModalWindowFin.setVisible(false);
    this.ModalWindowFinText.setVisible(false);
    this.setCompleteFlg = false;
    /*=================
    ボタン：レイアウトYES
    -------------------*/
    this.btnLayoutYes = this.scene.add.sprite(
      136,
      31,
      'spritesheet',
      'btn_yes'
    );
    this.btnLayoutYes.setInteractive();
    this.btnLayoutYes.on('pointerdown', function (pointer) {
      this.setKing();
    },this);
    this.btnLayoutYes.setVisible(false);

    /*=================
    ボタン：オートレイアウト
    -------------------*/
    this.btnOutLayout = this.scene.add.sprite(
      140,
      0,
      'spritesheet',
      'btn_auto_layout'
    );
    this.btnOutLayout.isToucked = false;
    this.btnOutLayout.alpha = 1;
    this.btnOutLayout.setInteractive();
    this.btnOutLayout.on('pointerdown', function (pointer) {
      let setting = {
        chessLayoutData: this.scene.chessAutoLayoutMapData,
        group: this.StageLayoutTileChessGroup.children.entries
      }
      this.btnOutLayout.alpha = 0.2;
      if(this.btnOutLayout.isToucked){
        return false;
      }
      this.autoLayout(setting);
      this.setKing();

      /*=====================
      データを代入
      =====================*/
      for(var i = 0; i < this.scene.chessMapData.length; i++){
        for(var k = 0; k < this.scene.chessMapData[i].length; k++){
          this.scene.chessMapData[i][k] = this.scene.chessAutoLayoutMapData[i][k];
        }
      }
      /*チェスを全て置いたかのチェック*/
      // this.checkLayoutIsAll();
      this.btnOutLayout.isToucked = true;

    },this);

    this.overlayArea = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );    
    this.rect = new Phaser.Geom.Rectangle(0, -16, this.scene.game.config.width, this.scene.game.config.height);
    this.overlayArea.fillRectShape(this.rect);
    this.overlayArea.alpha = 0.75;
    this.overlayArea.setScrollFactor(0);
    this.overlayArea.depth = 1;

    this.container.add(
      [
        // this.overlapArea,
        this.ModalWindow,
        this.ModalWindowSelectChessText,
        this.ModalWindowFin,
        this.ModalWindowFinText,
        this.btnLayoutYes,
        this.btnOutLayout
        
      ]
    );
    /*=================
    王（キング）設置のウィンドウ：説明
    -------------------*/
    this.ModalWindowKing = this.scene.add.sprite(
      this.scene.game.config.width/2,
      0,
      'spritesheet',
      'window_base'
    );
    this.ModalWindowKingText = this.scene.add.text(
      10, 
      -8, 
      ['王を決めてください。'],
      {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10,
      lineSpacing: 0
     }
    );      
    /*=================
    王（キング）のアイコン
    -------------------*/
    this.iconKing = this.scene.add.sprite(
      this.scene.game.config.width,
      0,
      'spritesheet',
      'icon_king'
    );
    this.iconKing.setVisible(false);
    
    this.iconKing.depth = 402;
       
    
    /*=================
    王（キング）設置のコンテナ
    -------------------*/ 
    this.kingContainer = this.scene.add.container();
    this.kingContainer.x = 0;
    this.kingContainer.y = 40;
    this.kingContainer.depth = 100; 
    this.kingContainer.add(
      [
        this.ModalWindowKing,
        this.ModalWindowKingText
      ]
    );
    this.kingContainer.setVisible(false);
    /*=================
    ゲームスタートのウィンドウ：完了
    -------------------*/
    this.GameStartContainer = this.scene.add.container();
    this.GameStartContainer.x = 0;
    this.GameStartContainer.y = 198;
    this.GameStartContainer.depth = 400;
    this.ModalGameStart = this.scene.add.sprite(
      this.scene.game.config.width/2,
      0,
      'spritesheet',
      'window_base'
    );
    this.ModalGameStartText = this.scene.add.text(
      10, 
      -8, 
      ['ゲームスタート'],
      {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10,
      lineSpacing: 0
     }
    ); 
    // this.ModalGameStart.setVisible(false);
    // this.ModalGameStartText.setVisible(false);
    // this.ModalGameStart.depth = 400;
    /*=================
    ボタン：ゲームスタートYES
    -------------------*/
    this.btnGameStartYes = this.scene.add.sprite(
      136,
      0,
      'spritesheet',
      'btn_yes'
    );
    this.btnGameStartYes.setInteractive();
    this.btnGameStartYes.on('pointerdown', function (pointer) {
      this.setYes();
    },this);
    // this.btnGameStartYes.setVisible(false);
    // this.btnGameStartYes.depth = 401;
    this.GameStartContainer.add(
      [
        this.ModalGameStart,
        this.ModalGameStartText,
        this.btnGameStartYes
      ]
    );
    this.GameStartContainer.setVisible(false);
    /*=================
    UIまわりの基準
    -------------------*/
    this.chessBaseHeight = 70;

    this.baseHeight = 132;
    this.addHeight = 32;

    this.setLayoutChessToStage();
    this.setLayoutPanelGroup();
    //レイアウトデータから再配置
    // this.setLayoutChessPos();
    //チェスじょうほうエリア
    this.createChessInfo();

  }
  touchLayoutChess(layoutChess){
    if(layoutChess.hasCount === 0){
      return false;
    }
    this.isTouchChess = true;
    this.chessCount++;
    /*カーソルの更新 */
    this.Cursor.setVisible(true);
    this.Cursor.x = layoutChess.x;
    this.Cursor.y = layoutChess.y;
    // let chessToTile = this.StageLayoutTileChessGroup.children.entries[this.chessCount-1];

    // this.selectedLayoutChess = chessToTile;
    this.selectedLayoutChess = layoutChess;

    this.setChessInfo(this.selectedLayoutChess);

  }
  setLayoutPanelGroup(){
    let baseHeight = this.baseHeight;
    let addHeight = this.addHeight;
    let n = 0;
    let tileX = 0;
    let tileY = 0;

    for(var i = 0; i < 6; i++){
      if(i % 3 === 0 && i !== 0){
        baseHeight += addHeight;
        tileX = 0;
        tileY++;
      }
      let sprite = this.scene.add.sprite(
        tileX * addHeight + addHeight/2,
        baseHeight,
        'spritesheet',
        'panel_add_layout'
      );
      sprite.setInteractive();
      sprite.depth = 5;
      sprite.tileIndex = i;
      sprite.tilePos = {
        X: tileX,
        Y: tileY + 3
      }
      tileX++;
      let _this = this;
      sprite.on('pointerdown', () => {
        this.touchLayoutTile(sprite);
      });
      this.StageLayoutTileGroup.add(sprite);
    }
  }
  touchLayoutTile(panel){
    if(this.scene.chessMapData[panel.tilePos.Y][panel.tilePos.X] !== 0){
      return false;
    }
    if(this.selectedLayoutChess){
      /*レイアウトの配列の更新 */
      if(this.isTouchChess){
        /*更新*/
        this.scene.chessMapData[panel.tilePos.Y][panel.tilePos.X] = this.selectedLayoutChess.groupIndex;
      }else{
        /*削除*/
        this.scene.chessMapData[this.beforeTilePos.Y][this.beforeTilePos.X] = 0;
        /*更新*/
        this.scene.chessMapData[panel.tilePos.Y][panel.tilePos.X] = this.selectedLayoutChess.groupIndex;
      }
      this.beforeTilePos.X = panel.tilePos.X;
      this.beforeTilePos.Y = panel.tilePos.Y;

      /*チェスを全て置いたかのチェック*/
      this.checkLayoutIsAll();

      let worldPos = {
        x: panel.x,
        y: panel.y
      }
      this.Cursor.x = panel.x;
      this.Cursor.y = panel.y;

      let chessToTile = this.StageLayoutTileChessGroup.children.entries[this.chessCount-1];
      if(this.isTouchChess){
        this.selectedLayoutChess.hasCount--;
        this.selectedLayoutChess.has_count_text.setText(this.selectedLayoutChess.hasCount);  
        this.isTouchChess = false;
      }
      chessToTile.move(worldPos,"tile");
      chessToTile.depth = 20;
      chessToTile.HP_text.depth = 22;
      chessToTile.AT_text.depth = 22;
      chessToTile.chessStatus.depth = 21;
      chessToTile.tilePos.X = panel.tilePos.X;
      chessToTile.tilePos.Y = panel.tilePos.Y;
      chessToTile.setTexture('spritesheet',this.selectedLayoutChess.frame.name);

      this.setChessInfo(this.selectedLayoutChess);
    }  
  }
  autoLayout(setting){
    let chessLayoutData = setting.chessLayoutData;
    let group = setting.group;

    for(var i = 0; i < chessLayoutData.length; i++){
      for(var k = 0; k < chessLayoutData[i].length; k++){
        if(chessLayoutData[i][k] !== 0){
          let _index = chessLayoutData[i][k];
          group.forEach(
            (sprite,index) => {
              if(sprite.groupIndex === _index){
                let settingPos = {
                  x: k * 32 + 16,
                  y: i * 32 + 16 + 20,
                }
                sprite.tilePos.X = k;
                sprite.tilePos.Y = i;
                sprite.move(settingPos);                
              }
            }
          );          
        }
      }  
    }
  }

  setLayoutChessToStage(){

    let playerChessList = this.chessDataMaster;
    let chessDataList = this.ChessData.chessList;

    let baseHeight = this.chessBaseHeight;
    let addHeight = this.addHeight;

    for(var i = 0; i < playerChessList.length;i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i][0]){
          let sprite = new Chess({
            scene: this.scene,
            x: i * addHeight + addHeight/2,
            y: baseHeight,
            frame: item.key,
            key: 'spritesheet'
          });

          sprite.setInteractive();

          sprite.status = item.status;
          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;
          sprite.areaMapBase = sprite.mergeArea(
            sprite.moveAreaMapBase,
            sprite.attackAreaMapBase,
            sprite.areaMapBase
          );
          sprite.depth = 12;
          sprite.groupIndex = i + 1;
          let settingStatus = {
            power: item.status.power,
            hp: item.status.maxHp,
            count: playerChessList[i][1]
          }
          sprite.setStatus(settingStatus);

          let settingPos = {
            x: i * addHeight + addHeight/2,
            y: baseHeight,
          }
          sprite.move(settingPos);

          sprite.hasCount = playerChessList[i][1];

          sprite.on('pointerdown', () => {
            this.touchLayoutChess(sprite);
          });
          this.StageLayoutChessGroup.add(sprite);

          /*移動表示用*/
          let spriteTile = new Chess({
            scene: this.scene,
            x: i * addHeight + addHeight/2,
            y: baseHeight,
            frame: item.key,
            key: 'spritesheet'
          });
          spriteTile.move(settingPos);
          spriteTile.depth = 5;
          spriteTile.HP_text.depth = 5;
          spriteTile.AT_text.depth = 5;
          spriteTile.chessStatus.depth = 4;
          spriteTile.groupIndex = i + 1;
          spriteTile.hasCount = playerChessList[i][1];
          spriteTile.setStatus(settingStatus);
          spriteTile.badge.setVisible(false);
          spriteTile.has_count_text.setVisible(false);          
          this.StageLayoutTileChessGroup.add(spriteTile);

        }
      },this);
    }
    
  }
  checkLayoutIsAll(){
    let count = 0;
    for(var i = 0; i < this.scene.chessMapData.length; i++){
      for(var k = 0; k < this.scene.chessMapData[i].length; k++){
        if(i >= 3 && k <= 2){
          if(this.scene.chessMapData[i][k] !== 0){
            count++;
          }          
        }
      }
    }
    if(count >= this.chessData.length){
      this.ModalWindowFin.setVisible(true);
      this.ModalWindowFinText.setVisible(true);
      this.btnLayoutYes.setVisible(true);
    }
  }
  setLayoutChessPos(){
    let baseLeft = 0;
    let baseHeight = 20;

    let layoutedChesses = this.chessMapData;
    let StageLayoutChessGroup = this.StageLayoutChessGroup.children.entries;
    for(var i = 0; i < layoutedChesses.length; i++){
      for(var k = 0; k < layoutedChesses[i].length; k++){
        if(layoutedChesses[i][k] !== 0){
          let count = Number(layoutedChesses[i][k]);
          let chess = StageLayoutChessGroup[count-1];
          chess.x = k * 32 + baseLeft;
          chess.y = i * 32 + baseHeight;
          chess.tilePos = {
            X: k,
            Y: i
          };
          chess.groupIndex = count;
        }
      }
    }
  }

  /*==================
  チェスのじょうほう
  ==================*/
  createChessInfo(){
    this.chessMoveArea = this.scene.add.group();
    let map = [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,9,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ];
    let baseLeft = 114;
    let baseHeight = 130;
    for(var i = 0; i < map.length;i++){
      for(var k = 0; k < map[i].length;k++){
        let mapTile = this.scene.add.sprite(
          k * 6 + baseLeft,
          i * 6 + baseHeight,
          'spritesheet',
          'movearea_s_default'
        );
        mapTile.depth = 20;
        if( i < 2 || 6 < i){
          mapTile.setVisible(false);
        }
        if( k < 2 || 6 < k){
          mapTile.setVisible(false);
        }
        this.chessMoveArea.add(mapTile)
      }
    }
    
    this.chessDisp = this.scene.add.sprite(
      baseLeft + 16,
      baseHeight - 5,
      'spritesheet',
      'chess_shadow'
    ); 
    this.chessDisp.depth = 12;
    this.chessDisp.scaleX = 2;
    this.chessDisp.scaleY = 2;
    
    this.move_icons = this.scene.add.sprite(
      baseLeft - 3,
      baseHeight + 22,
      'spritesheet',
      'move_icons'
    );  
    this.move_icons.depth = 12;   

    this.overlapArea = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );    
    this.rect = new Phaser.Geom.Rectangle(baseLeft + 8, baseHeight + 8, 31, 31);
    this.overlapArea.fillRectShape(this.rect);
    this.overlapArea.depth = 10;
  }
  setChessInfo(sprite){

    let row = sprite.areaMapBase.length;

    this.chessDisp.setTexture('spritesheet',sprite.frame.name);


    for(var i = 0; i < sprite.areaMapBase.length; i++){
      for(var k = 0; k < sprite.areaMapBase[i].length; k++){
        let movearea;
        if(sprite.areaMapBase[i][k] === 1){//移動
          movearea = "movearea_s_move";
        }
        if(sprite.areaMapBase[i][k] === 2){//攻撃
          movearea = "movearea_s_attack";
        }
        if(sprite.areaMapBase[i][k] === 3){//移動＆攻撃
          movearea = "movearea_s_move_attack";
        }
        if(sprite.areaMapBase[i][k] === 9){//移動
          movearea = "movearea_s_chess";
        }
        if(sprite.areaMapBase[i][k] === 0){//なし
          movearea = "movearea_s_default";
        }
        this.chessMoveArea.children.entries[i * row + k].setTexture('spritesheet',movearea);
      }
    }
  }
  /*================================
  王の決定＆駒にセット
  ================================*/
  setKingToChess(){
    let chessKingGroupIndex = this.chessKingGroupIndex;
    let _this = this;
    this.scene.GameManager.playerChessGroup.children.entries.forEach(
      (sprite,index) => {
        if(sprite.tilePos.X === _this.kingPos.X && sprite.tilePos.Y === _this.kingPos.Y){
          sprite.icon_king.setVisible(true);
          sprite.isKing = true;
        }
      }
    );
  }
  /*================================
  王の設定
  ================================*/  
  setKing(){
    this.kingContainer.setVisible(true);
    this.scene.GameManager.UIManager.ItemGroup.removeGroupInteractive();
    this.hideLayoutUI();
    this.hideChess();
    this.setLayoutKingGroup();
  }
  setLayoutKingGroup(){

    let _this = this;
    
    this.StageLayoutTileChessGroup.children.entries.forEach(
      (sprite,index) => {
        let panel = this.scene.add.sprite(
          sprite.x,
          sprite.y,
          'spritesheet',
          'panel_add_layout'
        );
        panel.setInteractive();
        panel.depth = 100;
        // panel.groupIndex = sprite.groupIndex;
        panel.groupIndex = index;
        panel.tilePos = {
          X: sprite.tilePos.X,
          Y: sprite.tilePos.Y
        }
        panel.on('pointerdown', () => {
          _this.iconKing.x = panel.x;
          _this.iconKing.y = panel.y;
          // _this.iconKing.groupIndex = panel.groupIndex;
          _this.GameStartContainer.setVisible(true);
          // _this.ModalGameStart.setVisible(true);
          // _this.ModalGameStartText.setVisible(true);
          _this.iconKing.setVisible(true);
          _this.kingPos.X = panel.tilePos.X;
          _this.kingPos.Y = panel.tilePos.Y;
        });
        this.StageKingTileGroup.add(panel);
      },this
    );     

  }  
  setYes(){
    this.hideAll();
    this.makePlayerChessList();
    this.scene.GameManager.UIManager.ItemGroup.addGroupInteractive();
    this.scene.layoutFin();
    this.setKingToChess();
  }
  makePlayerChessList(){
    let count = 0;

    for(var i = 0; i < this.scene.chessMapData.length;i++){
      for(var k = 0; k < this.scene.chessMapData[i].length;k++){
        if(this.scene.chessMapData[i][k] !== 0){
          this.chessData[count] = "chess_"+this.scene.chessMapData[i][k];
          count++;
        }
      }      
    }
    this.scene.registry.list.chessData = this.chessData;

  }
  hideLayoutUI(){
    this.Cursor.setVisible(false);
    this.container.setVisible(false);
    this.chessMoveArea.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
      }
    );
    this.chessDisp.setVisible(false);
    this.move_icons.setVisible(false);
    this.overlapArea.setVisible(false);
    this.StageLayoutTileGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
      }
    );   

  }
  hideChess(){
    this.StageLayoutChessGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
        sprite.AT_text.setVisible(false);
        sprite.HP_text.setVisible(false);
        sprite.chessStatus.setVisible(false);
        sprite.has_count_text.setVisible(false);
        sprite.badge.setVisible(false);
      }
    );
  }
  hideAll(){
    /*王*/
    this.iconKing.setVisible(false);
    this.btnGameStartYes.setVisible(false);
    this.ModalGameStart.setVisible(false);
    this.ModalGameStartText.setVisible(false);
    this.kingContainer.setVisible(false);
    /*デフォルト*/
    this.Cursor.setVisible(false);
    this.container.setVisible(false);
    this.chessMoveArea.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
      }
    );
    this.chessDisp.setVisible(false);
    this.move_icons.setVisible(false);
    this.overlapArea.setVisible(false);
    this.overlayArea.setVisible(false);

    this.StageLayoutTileChessGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
        sprite.AT_text.setVisible(false);
        sprite.HP_text.setVisible(false);
        sprite.chessStatus.setVisible(false);
        sprite.has_count_text.setVisible(false);
        sprite.badge.setVisible(false);
      }
    );    
    this.StageLayoutTileGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);    
      }
    );  
    this.StageKingTileGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
      }
    );      
  }
}