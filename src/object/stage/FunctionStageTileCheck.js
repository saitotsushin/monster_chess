/*==============================
ステージ上のタイルのチェック
==============================*/    
export function tileCheck(scene,tile,pos){

  let StageManager  = scene.StageManager;
  let MoveArea      = scene.StageManager.MoveArea;
  let selectedChess = scene.PlayerManager.selectedChess;
  let selectedTrap = scene.PlayerManager.selectedTrap;
  let areaMap       = selectedChess ? selectedChess.areaMap : "";
  let enemyChess    = "";
  let STATUS_STAGE  = scene.StageManager.STATUS.STAGE;
  let NOW_TURN      = scene.StageManager.STATUS.TURN;
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

  if(playerType === "player1"){
    if(STATUS_STAGE === "SELECTED_TRAP"){
      checkObject.nextPos.X = X;
      checkObject.nextPos.Y = Y;
      return checkObject;
    }
    if(selectedChess){
      MoveArea.hide(selectedChess);
    }
    scene.PlayerManager.selectedChess = tileObject;
    selectedChess = tileObject;
    // MoveArea.setArrPosition(X,Y,tileObject);
    MoveArea.show(selectedChess);
    /*選択時の位置を保存*/
    scene.StageManager.beforeChessPos.X = X;
    scene.StageManager.beforeChessPos.Y = Y;
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
        console.info("移動可能");
        checkObject.MODE = "MOVE";
        checkObject.nextPos.X = X;
        checkObject.nextPos.Y = Y;
      }
    }
    return checkObject;
  }

}
