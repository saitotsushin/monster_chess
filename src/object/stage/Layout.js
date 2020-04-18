import Chess from '../ui/menu/Chess';

export default class Layout{
  constructor(config) {
    this.scene = config.scene;
    this.create();
    this.stageCanSetArr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1]
    ];
  }
  create(){
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

    this.player1Auto_Arr = this.scene.PlayerManager.player1Auto_Arr;
 
    this.container = this.scene.add.container();
    this.container.x = 0;
    this.container.y = 80;
    this.container.depth = 100; 

    /*=================
    レイアウトのウィンドウ
    -------------------*/
    this.ModalWindow = this.scene.add.sprite(
      this.scene.game.config.width/2,
      0,
      'spritesheet',
      'window_layout'
    );
    this.setCompleteFlg = false;
    /*=================
    ボタン：YES
    -------------------*/
    this.btnYes = this.scene.add.sprite(
      78,
      0,
      'spritesheet',
      'btn_yes'
    );
    this.btnYes.setInteractive();
    this.btnYes.on('pointerdown', function (pointer) {
      this.setYes();
    },this);

    this.container.add(
      [
        this.ModalWindow,
        this.btnYes
      ]
    );    
  }
  touchLayoutChess(layoutChess){
    /*カーソルの更新 */
    this.Cursor.setVisible(true);
    this.Cursor.x = layoutChess.x;
    this.Cursor.y = layoutChess.y;

    this.selectedLayoutChess = layoutChess;

  }
  touchLayoutTile(layoutTile){
    if(this.selectedLayoutChess){
      /*レイアウトの配列の更新 */
      /*削除*/
      this.player1Auto_Arr[this.selectedLayoutChess.tilePos.Y][this.selectedLayoutChess.tilePos.X] = 0;
      /*更新*/
      this.player1Auto_Arr[layoutTile.tilePos.Y][layoutTile.tilePos.X] = this.selectedLayoutChess.layoutIndex;

      /*選択したチェスの更新 */
      this.selectedLayoutChess.x = layoutTile.x;
      this.selectedLayoutChess.y = layoutTile.y;
      this.selectedLayoutChess.tilePos = layoutTile.tilePos;

      /*カーソルの更新 */
      this.Cursor.setVisible(true);
      this.Cursor.x = layoutTile.x;
      this.Cursor.y = layoutTile.y;

      /*移動ごとに保存*/
      this.scene.registry.list.player1Auto_Arr = this.player1Auto_Arr;

    }
  }
  setLayoutGroup(){
    let baseHeight = 120;
    let addHeight = 20;
    let n = 0;
    let tileX = 0;
    let tileY = 0;

    for(var i = 0; i < 18; i++){
      if(i % 6 === 0 && i !== 0){
        baseHeight += addHeight;
        tileX = 0;
        tileY++;
      }
      let sprite = this.scene.add.sprite(
        tileX * addHeight + 20,
        baseHeight,
        'spritesheet',
        'panel_add_team_1'
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
    let playerChessList = this.scene.PlayerManager.player1_ChessList;
    let chessDataList = this.scene.ChessManager.ChessData.chessList;
    for(var i = 0; i < playerChessList.length;i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          let sprite = new Chess({
            scene: this.scene,
            x: i * 20 + 20,
            y: 80,
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
          sprite.cost = item.cost;
          sprite.no = item.no;
          sprite.name = item.key;
          sprite.depth = 12;

          sprite.on('pointerdown', () => {
            this.touchLayoutChess(sprite);
          }); 
          this.StageLayoutChessGroup.add(sprite)
        }
      },this);
    }
    this.setLayoutChessPos();
  }
  setLayoutChessPos(){
    let baseLeft = 20;
    let baseHeight = 20;
    let layoutedChesses = this.scene.PlayerManager.player1Auto_Arr;
    let StageLayoutChessGroup = this.StageLayoutChessGroup.children.entries;
    for(var i = 0; i < layoutedChesses.length; i++){
      for(var k = 0; k < layoutedChesses[i].length; k++){
        if(layoutedChesses[i][k] !== 0){
          let count = Number(layoutedChesses[i][k]);
          let chess = StageLayoutChessGroup[count-1];
          chess.x = k * 20 + baseLeft;
          chess.y = i * 20 + baseHeight;
          chess.tilePos = {
            X: k,
            Y: i
          };
          chess.layoutIndex = count;
        }
      }
    }
  }
  setYes(){
    this.hideAll();
    /*レイアウト設定*/
    if(this.scene.registry.list.gameMode === "NET"){
      this.scene.StageManager.Network.setDBLayout();
    }else{
      this.scene.StageManager.gameStart();
    }
    this.scene.StageManager.STATUS.STAGE = '';
  }
  hideAll(){
    this.Cursor.setVisible(false);
    this.container.setVisible(false);
    this.StageLayoutChessGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
      }
    );   
    this.StageLayoutTileGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(false);
      }
    );   
  }
}