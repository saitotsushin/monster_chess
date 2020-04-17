export default class TouchedTile {
  constructor(config) {
    this.scene = config.scene;
    // this.marker = config.scene.add.graphics();
    // this.marker.lineStyle(3, 0xffffff, 1);
    // this.marker.strokeRect(
    //   0,
    //   0,
    //   config.scene.map.tileWidth,
    //   config.scene.map.tileHeight
    // );
    // this.marker.depth = 150;
    this.create();
  }
  create(){
    /*=================
    カーソル
    =================*/
    this.marker = this.scene.add.sprite(
      20,
      40,
      'spritesheet',
      'cursor'
    );
    this.marker.depth = 150;
    this.marker.setVisible(false);
  }
  getTilePosition(){

    this.marker.setVisible(true);

    var worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);

    var pointerTileX = this.scene.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.scene.map.worldToTileY(worldPoint.y);

    this.marker.x = this.scene.map.tileToWorldX(pointerTileX) + 10;
    this.marker.y = this.scene.map.tileToWorldY(pointerTileY) + 10;
    var tile = this.scene.map.getTileAt(pointerTileX, pointerTileY);

    let postion = {
      number: {
        X: 0,
        Y: 0
      },
      local: {
        x: 0,
        y: 0  
      },
      world:{
        x: 0,
        y: 0  
      }
    }

    let layer = this.scene.StageManager.StageLayer.layer;
 
    if (tile){
      postion.number.X = pointerTileX;
      postion.number.Y = pointerTileY;
      postion.local.x  = tile.y * this.scene.map.tileWidth + layer.x;
      postion.local.y  = tile.y * this.scene.map.tileHeight + layer.y;
      postion.world.x  = tile.y * this.scene.map.tileWidth;
      postion.world.y  = tile.y * this.scene.map.tileHeight;
      return postion;
    }
  }
  tileCheck(tile,pos){

    let StageManager  = this.scene.StageManager;
    let MoveArea      = this.scene.StageManager.MoveArea;
    let selectedChess = this.scene.PlayerManager.selectedChess;
    let selectedTrap  = this.scene.PlayerManager.selectedTrap;
    let areaMap       = selectedChess ? selectedChess.areaMap : "";
    let enemyChess    = "";
    let STATUS_STAGE  = this.scene.StageManager.STATUS.STAGE;
    let NOW_TURN      = this.scene.StageManager.STATUS.TURN;
    let X             = pos.number.X;
    let Y             = pos.number.Y;
    let tileObject    = tile.object;
    let playerType    = tile.object.playerType ? tile.object.playerType : "";
    let checkObject = {
      MODE: "",
      object: "",
      nextPos:{
        X: 0,
        Y: 0
      }
    }
    this.scene.StageManager.nowObject = tileObject;

    if(tileObject.playerType === "player1"){
      if(STATUS_STAGE === "ITEM"){
        checkObject.nextPos.X = X;
        checkObject.nextPos.Y = Y;
        
        return checkObject;
      }
    }
    // let flgMoved = false;
    let movedChess = this.scene.PlayerManager.movedChess;

    if(movedChess){
      if(movedChess.playerType === tileObject.playerType){
        if(movedChess.groupIndex !== tileObject.groupIndex){
          console.info("移動済み。他の駒は選択できない。")
          return;
        }
      }
    }

    if(tileObject.playerType === "player1"){
      // if(STATUS_STAGE === "ITEM"){
      //   checkObject.nextPos.X = X;
      //   checkObject.nextPos.Y = Y;
        
      //   return checkObject;
      // }
      if(selectedChess){
        MoveArea.hide(selectedChess);
      }
      this.scene.PlayerManager.selectedChess = tileObject;
      selectedChess = tileObject;
      // MoveArea.setArrPosition(X,Y,tileObject);
      MoveArea.show(selectedChess);
      /*選択時の位置を保存*/
      StageManager.beforeChessPos.X = X;
      StageManager.beforeChessPos.Y = Y;
      return checkObject;
    }
    if(selectedChess && areaMap !== ""){
      if(areaMap[Y][X] === 0){
        return;
      }
      if(areaMap[Y][X] === 1){
        if(tileObject){
          console.info("移動不可");
          return;
        }
        if(movedChess){
          console.info("移動済み、移動不可");
          return;
        }        
        console.info("移動可能");
        checkObject.MODE = "MOVE";
        checkObject.nextPos.X = X;
        checkObject.nextPos.Y = Y;
      }
      if(areaMap[Y][X] === 2){
        if(playerType === "player2"){
          console.info("攻撃可能");
          checkObject.MODE = "ATTACK";
          checkObject.object = tileObject;
        }else{
          console.info("攻撃相手がいない");
        }
      }
      if(areaMap[Y][X] === 3){
        if(playerType === "player2"){
          console.info("攻撃可能");
          enemyChess = tileObject;
          checkObject.MODE = "ATTACK";
          checkObject.object = tileObject;
        }else{
          if(tileObject){
            console.info("移動不可");
            return;
          }
          if(movedChess){
            console.info("移動駒の選択後、移動不可");
            return;
          }
          console.info("移動可能");
          checkObject.MODE = "MOVE";
          checkObject.nextPos.X = X;
          checkObject.nextPos.Y = Y;
        }
      }
      return checkObject;
    }
  }
}