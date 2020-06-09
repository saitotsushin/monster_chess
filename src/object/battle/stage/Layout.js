import Chess from '../../ui/menu/Chess';
import ChessData     from '../../../data/ChessData';

export default class Layout{
  constructor(config) {
    this.scene = config.scene;
    this.chessMapData = [];
    this.CreateChessInfo;

    this.chessMoveArea;

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

    this.ChessData = new ChessData();

    this.StageLayoutChessGroup = this.scene.add.group();
    this.StageLayoutTileGroup = this.scene.add.group();
    
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

 
    this.container = this.scene.add.container();
    this.container.x = 0;
    this.container.y = 40;
    this.container.depth = 100; 

    /*=================
    レイアウトのウィンドウ：説明
    -------------------*/
    this.ModalWindow = this.scene.add.sprite(
      this.scene.game.config.width/2,
      0,
      'spritesheet',
      'window_layout'
    );
    /*=================
    レイアウトのウィンドウ：完了
    -------------------*/
    this.ModalWindowFin = this.scene.add.sprite(
      this.scene.game.config.width/2,
      160,
      'spritesheet',
      'window_layout_fin'
    );
    this.ModalWindowFin.setVisible(false);
    this.setCompleteFlg = false;
    /*=================
    ボタン：YES
    -------------------*/
    this.btnYes = this.scene.add.sprite(
      136,
      159,
      'spritesheet',
      'btn_yes'
    );
    this.btnYes.setInteractive();
    this.btnYes.on('pointerdown', function (pointer) {
      console.log("はい　オートレイアウト");
      this.setYes();
    },this);
    this.btnYes.setVisible(false);

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
    console.log("this.scene",this.scene)
    console.log("this.chessMapData",this.scene.chessMapData);
    console.log("this.chessMapData2",this.scene.chessMapData2);
    this.btnOutLayout.on('pointerdown', function (pointer) {
      let setting = {
        chessLayoutData: this.scene.chessAutoLayoutMapData,
        group: this.StageLayoutChessGroup.children.entries
      }
      this.btnOutLayout.alpha = 0.2;
      if(this.btnOutLayout.isToucked){
        return false;
      }

      this.autoLayout(setting);
      /*データを代入*/
      this.scene.chessMapData = this.scene.chessAutoLayoutMapData;
      /*チェスを全て置いたかのチェック*/
      this.checkLayoutIsAll();
      this.btnOutLayout.isToucked = true;

    },this);
    // this.btnOutLayout.setVisible(false);

    this.container.add(
      [
        this.ModalWindow,
        this.ModalWindowFin,
        this.btnYes,
        this.btnOutLayout
      ]
    );

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
    /*カーソルの更新 */
    this.Cursor.setVisible(true);
    this.Cursor.x = layoutChess.x;
    this.Cursor.y = layoutChess.y;

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
      sprite.depth = 10;
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
    if(this.selectedLayoutChess){
      console.log("selectedLayoutChess",this.selectedLayoutChess.tilePos)
      /*レイアウトの配列の更新 */
      if(this.selectedLayoutChess.tilePos.X !== 0 && this.selectedLayoutChess.tilePos.Y !== 0){
        /*削除*/
        this.scene.chessMapData[this.selectedLayoutChess.tilePos.Y][this.selectedLayoutChess.tilePos.X] = 0;
        /*更新*/
        this.scene.chessMapData[panel.tilePos.Y][panel.tilePos.X] = this.selectedLayoutChess.groupIndex;
      }else{
        /*更新*/
        this.scene.chessMapData[panel.tilePos.Y][panel.tilePos.X] = this.selectedLayoutChess.groupIndex;
      }
      console.log("this.scene.chessMapData",this.scene.chessMapData)
      /*チェスを全て置いたかのチェック*/
      this.checkLayoutIsAll();

      let worldPos = {
        x: panel.x,
        y: panel.y
      }
      this.selectedLayoutChess.move(worldPos);
      this.selectedLayoutChess.tilePos.X = panel.tilePos.X;
      this.selectedLayoutChess.tilePos.Y = panel.tilePos.Y;
      this.Cursor.x = panel.x;
      this.Cursor.y = panel.y;
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

    let playerChessList = this.chessData;
    let chessDataList = this.ChessData.chessList;

    let baseHeight = this.chessBaseHeight;
    let addHeight = this.addHeight;

    for(var i = 0; i < playerChessList.length;i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          let sprite = new Chess({
            scene: this.scene,
            x: i * addHeight + addHeight/2,
            y: baseHeight,
            frame: item.key,
            key: 'spritesheet'
          });
          sprite.depth = 20;
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
            hp: item.status.maxHp
          }
          sprite.setStatus(settingStatus);

          let settingPos = {
            x: i * addHeight + addHeight/2,
            y: baseHeight,
          }
          sprite.move(settingPos);

          sprite.on('pointerdown', () => {
            this.touchLayoutChess(sprite);
          });
          this.StageLayoutChessGroup.add(sprite);

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
      this.btnYes.setVisible(true);
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
  setYes(){
    this.hideAll();
    this.scene.layoutFin();
  }
  hideAll(){
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
    this.StageLayoutChessGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
        sprite.AT_text.setVisible(false);
        sprite.HP_text.setVisible(false);
        sprite.chessStatus.setVisible(false);
      }
    );   
    this.StageLayoutTileGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
      }
    );   
  }
}