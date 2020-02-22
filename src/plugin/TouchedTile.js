export default class TouchedTile {
  constructor(gameScene) {
    this.scene = gameScene.scene;
    this.marker = this.scene.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(
      0,
      0,
      this.scene.map.tileWidth,
      this.scene.map.tileHeight
    );
    this.marker.depth = 5;
  }
  setStageTile(x,y){
    /*============
    タイルの取得
    ============*/
    let tile = this.scene.stageData.tilePropertyArr[y][x];

    if(this.scene.STAGE_STATUS === "SET_CHESS"){

      if(this.scene.setChess.player1_Arr[y][x] === 1 
        && this.scene.setChess.scene.Player.selectedChess){
        this.scene.modalManager.layout.open();
        this.CHESS_STATUS = "set";  
      }else{
        this.scene.modalManager.close();
        this.CHESS_STATUS = "";  
      }
      return;
    }

    /*================
    モンスターを選択 ＆ 選択したモンスターの保存
    ================*/
    if(tile.object.type === "player1"){
      /*================
      トラップ選択中
      ================*/
      if(this.scene.STAGE_STATUS === "SELECTED_TRAP"){
        this.scene.Player.selectedTrap.x = x;
        this.scene.Player.selectedTrap.y = y;
        this.scene.modalManager.trap.open();
      }else{
        if(this.scene.CHESS_STATUS === "FIN"){
          return;
        }
        this.scene.stageManager.moveArea.hide(this.scene.Player.selectedChess);         
        this.scene.stageManager.scene.Player.selectedChess = tile.object;
        this.scene.stageManager.moveArea.show(this.scene.Player.selectedChess);
        this.scene.stageManager.beforeChessPos.x = x;
        this.scene.stageManager.beforeChessPos.y = y;
        this.scene.STAGE_STATUS = "SELECTED_CHESS";
      }
    }


    /*================
    モンスターを選択中
    ================*/
    if(this.scene.STAGE_STATUS === "SELECTED_CHESS"){
      //移動可能
      if(this.scene.Player.selectedChess.areaArr[y][x] === 1){
        this.scene.modalManager.move.open();
        this.scene.CHESS_STATUS = "MOVE";
      }
      //攻撃可能
      if(this.scene.Player.selectedChess.areaArr[y][x] === 2){
        if(tile.object.type === "player2"){
          this.scene.stageManager.enemyChess = tile.object;
          this.scene.modalManager.attack.open();
          this.scene.CHESS_STATUS = "ATTACK";
        }
      }
      //移動＆攻撃可能
      if(this.scene.Player.selectedChess.areaArr[y][x] === 3){
        if(tile.object.type === "player2"){
          this.scene.stageManager.enemyChess = tile.object;
          this.scene.modalManager.attack.open();
          this.scene.CHESS_STATUS = "ATTACK";
        }else{
          this.scene.modalManager.move.open();
          this.scene.CHESS_STATUS = "MOVE";     
        }
      }
      if(this.scene.Player.selectedChess.areaArr[y][x] === 0){
        this.scene.modalManager.close();
        this.scene.STAGE_STATUS = ""; 
        this.scene.CHESS_STATUS = ""
      }
    }
  }
  getTilePosition(){

    var worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);

    // Rounds down to nearest tile
    var pointerTileX = this.scene.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.scene.map.worldToTileY(worldPoint.y);

    // Snap to tile coordinates, but in world space
    this.marker.x = this.scene.map.tileToWorldX(pointerTileX);
    this.marker.y = this.scene.map.tileToWorldY(pointerTileY);
    var tile = this.scene.map.getTileAt(pointerTileX, pointerTileY);

    let postion = {
      localNumber: {
        x: 0,
        y: 0  
      },
      world:{
        x: 0,
        y: 0  
      }
    }

    if (tile)
    {
        postion.world.x = tile.x * this.scene.map.tileWidth + this.scene.stageLayer.x;
        postion.world.y = tile.y * this.scene.map.tileHeight + this.scene.stageLayer.y;
        postion.localNumber.x = (postion.world.x - this.scene.stageLayer.x) /this.scene.map.tileWidth;
        postion.localNumber.y = (postion.world.y - this.scene.stageLayer.y) /this.scene.map.tileHeight;
        return postion;
    }
  }
}