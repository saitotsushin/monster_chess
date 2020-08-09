export default class ChessInfoWindow{
  constructor(config) {

    this.scene = config.scene;
    this.mapData = config.mapData ? config.mapData : "";
    this.mapTile = config.mapTile;
    this.layer = config.layer;
    this.itemTouchTileGroup;
    this.ChessInfoContainer;
    // this.selecteditem;    
    // this.create();
  }
  create(){
    this.ChessInfoContainer = this.scene.add.container(0, 0);
    this.ChessInfoMoveGroup = this.scene.add.group();
    /*=================
    チェスのインフォメーション
    -------------------*/
    /*チェスのウィンドウ
    -------------------*/
    let baseTop = 100;
    let baseLeft = 9;
    this.ChessTextWindow = this.scene.add.sprite(
      baseLeft,
      baseTop,
      'spritesheet',
      'window_info_L'
    );
    this.ChessTextWindow.setOrigin(0,0);
    /* チェスのウィンドウクローズ
    -------------------*/
    // this.btnChessInfoWindowClose = this.scene.add.sprite(
    //   102,
    //   94,
    //   'spritesheet',
    //   'btn_close'
    // );
    // this.btnChessInfoWindowClose.setInteractive();
    // this.btnChessInfoWindowClose.on('pointerdown', () => {
    //   this.hideWindow();
    // }); 
    this.chessInfoImage = this.scene.add.sprite(
      baseLeft + 42,
      baseTop + 20,
      'spritesheet',
      'chess_1'
    );
    this.chessInfoImage.scaleX = 2;
    this.chessInfoImage.scaleY = 2;

    this.chessInfoNumb = this.scene.add.bitmapText(
      baseLeft + 3,
      baseTop + 23,
      'bitmapFont',
      '00',
      10
    );
    this.chessInfoNumb.setLetterSpacing = 2;
    this.chessInfoHp = this.scene.add.bitmapText(
      baseLeft + 59,
      baseTop + 49,
      'bitmapFont',
      '00',
      10
    );
    this.chessInfoHp.setOrigin(1).setRightAlign();
    this.chessInfoAttack = this.scene.add.bitmapText(
      baseLeft + 59,
      baseTop + 61,
      'bitmapFont',
      '000',
      10
    );
    this.chessInfoAttack.setOrigin(1).setRightAlign();
    this.chessInfoDifence = this.scene.add.bitmapText(
      baseLeft + 59,
      baseTop + 73,
      'bitmapFont',
      '000',
      10
    );
    this.chessInfoDifence.setOrigin(1).setRightAlign();
    this.ChessInfoContainer.add(
      [
        this.ChessTextWindow,
        // this.btnChessInfoWindowClose,
        this.chessInfoNumb,
        this.chessInfoHp,
        this.chessInfoAttack,
        this.chessInfoDifence,
        this.chessInfoImage
      ]
    );
    for(var i = 0; i < 8;i++){
      for(var k = 0; k < 7; k++){

        let sprite = this.scene.add.sprite(
          k * 5 + baseLeft + 81 + k,
          i * 5 + baseTop + 28 + i,
          'spritesheet',
          'movearea_s_default'
        );
        sprite.depth = 405;

        this.ChessInfoMoveGroup.add(sprite);

      }
    }
    

    this.ChessInfoContainer.depth = 400;
    /*=================
    タッチエリア
    -------------------*/
    let area;
    this.infoTouchTileGroup = this.scene.add.group();
    let _this = this;
    if(!this.mapData){
      return;
    }
    for(var i = 0; i < this.mapData.length; i++){
      for(var k = 0; k < this.mapData[i].length; k++){
        area = this.scene.add.sprite(0,0,'spritesheet',"panel_add_team");
        area.x = k * this.mapTile.tileWidth + this.mapTile.tileWidth/2 + this.layer.x;
        area.y = i * this.mapTile.tileHeight + this.mapTile.tileHeight/2 + this.layer.y;
        area.pos = {
          X: k,
          Y: i
        }
        area.setInteractive();
        // area.setVisible(false);
        area.depth = 200;
        this.infoTouchTileGroup.add(area);
        area.on('pointerdown', function (pointer) {
          // _this.scene.touchInfoTile(this.pos);
          // return this.pos;
        }); 
      }
    }    
    /*=================
    スタート
    -------------------*/
    // this.hideTile();
    // this.hideWindow();

  }
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
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0]
    ];
    let harfHeight = (base.length - 1) / 2;
    let harfWidth = (base[0].length - 1) / 2 + 0.5;
    // let harfWidth = 7;
    let baseY = harfHeight - Y;
    let baseX = harfWidth - X - 0.5;
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
  /*==============================
  表示・非表示
  ------------------------------*/   
  /*ストックの駒
  ------------------------------*/
  showWindow(){
    this.ChessInfoContainer.setVisible(true);
    this.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }
  showTile(){
    this.infoTouchTileGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );    
  }
  showCanPutTile(){
    let map = this.scene.registry.list.chessMapData;
    let map2 = this.scene.registry.list.chessMapData2;
    let margeMap = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    for(var i = 0; i < margeMap.length; i++){
      for(var k = 0; k < margeMap[i].length; k++){
        if(map[i][k] !== 0){
          margeMap[i][k] = map[i][k];
        }
        if(map2[i][k] !== 0){
          margeMap[i][k] = map2[i][k];
        }
      }
    }
    let row = 0;
    let COL_MAX = 6;

    let infoTouchTileGroup = this.infoTouchTileGroup.children.entries;
    let _this = this;
    for(var i = 0; i < margeMap.length; i++){
      for(var k = 0; k < margeMap[i].length; k++){
        let tile = infoTouchTileGroup[k + row * COL_MAX];
        if(margeMap[i][k] !== 0){
          tile.setTexture('spritesheet','panel_add_team');
          tile.on('pointerdown', function (pointer) {
            // if(!this.scene.GameManager.UIManager.selectedItem){
            //   alert("トラップが選択されていません。")
            // }else{
            // }
            // let itemIndex = this.scene.GameManager.UIManager.selectedItem.itemIndex; 
            _this.scene.touchInfoTile(this.pos);  

          }); 
        }else{
          tile.setTexture('spritesheet','chess_shadow');
          tile.on('pointerdown', function (pointer) {

          }); 
        }
      }
      row++;
    }

  }  
  hide(){
    this.hideWindow();
    this.hideTile();    
  }
  hideWindow(){
    this.ChessInfoContainer.setVisible(false)
    this.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
  }
  hideTile(){
    this.infoTouchTileGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );    
  }
}
