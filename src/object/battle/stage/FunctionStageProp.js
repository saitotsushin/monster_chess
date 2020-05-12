
/*==============
ステージの座標から位置を返す
==============*/
export function getTilePositionNumber(X,Y,scene){
  let tileWidth = scene.map.tileWidth;
  let tileHeight = scene.map.tileHeight;
  let layer = scene.StageManager.StageLayer.layer;
  let position = {
    local: {
      x: 0,
      y: 0  
    },
    world:{
      x: 0,
      y: 0  
    }
  }
  position.world.x = X * tileWidth + layer.x + tileWidth/2;
  position.world.y = Y * tileHeight + layer.y + tileHeight/2;
  position.local.x = X * tileWidth;
  position.local.y = Y * tileHeight;   
  
  return position;
}

/*==============================
ステージにプロパティ追加
==============================*/    
export function setProp(scene,_player1ChessGroup,_player2ChessGroup){
  let player1_Arr = scene.PlayerManager.player1Auto_Arr;
  let player2_Arr = scene.PlayerManager.player2Auto_Arr;
  let player1ChessGroup = _player1ChessGroup;
  let player2ChessGroup = _player2ChessGroup;
  let tilePropArr = scene.StageManager.tilePropMap;
  let MoveArea = scene.StageManager.MoveArea;

  for(var i = 0; i < player1_Arr.length;i++){
    for(var k = 0; k < player1_Arr[i].length;k++){
      if(player1_Arr[i][k] !== 0){

        tilePropArr[i][k].object = player1ChessGroup[player1_Arr[i][k]-1];

      }
    }
  }
  for(var i = 0; i < player2_Arr.length;i++){
    for(var k = 0; k < player2_Arr[i].length;k++){
      if(player2_Arr[i][k] !== 0){

        tilePropArr[i][k].object = player2ChessGroup[player2_Arr[i][k]-1];

      }
    }
  }
  /*
  プロパティをセットしてから移動範囲を作る
  移動先で駒の先を判定するため。
  */
  for(var i = 0; i < player1_Arr.length;i++){
    for(var k = 0; k < player1_Arr[i].length;k++){
      if(player1_Arr[i][k] !== 0){

        tilePropArr[i][k].object.areaMap = MoveArea.getAreaMap(k,i,player1ChessGroup[player1_Arr[i][k]-1]);

      }
    }
  }
  for(var i = 0; i < player2_Arr.length;i++){
    for(var k = 0; k < player2_Arr[i].length;k++){
      if(player2_Arr[i][k] !== 0){

        tilePropArr[i][k].object.areaMap = MoveArea.getAreaMap(k,i,player2ChessGroup[player2_Arr[i][k]-1]);

      }
    }
  }
}
/*==============================
ステージにチェスのプロパティ変更
==============================*/    
export function updateStageProps(scene,chess){
  let StageManager    = scene.StageManager;
  let beforePos       = StageManager.beforeChessPos;
  let nextPos         = {
    X: 0,
    Y: 0
  };
  let nextChessPos    = StageManager.nextChessPos;
  let selectedChess   = chess;
  let MoveArea        = StageManager.MoveArea;


  if(!nextChessPos.X && !nextChessPos.Y){
    nextPos = beforePos;
    return;
  }else{
    nextPos = nextChessPos;
  }

  /*前の駒をステージから削除*/
  scene.StageManager.tilePropMap[beforePos.Y][beforePos.X].object = "";
  /*移動する駒をステージに追加*/
  scene.StageManager.tilePropMap[nextPos.Y][nextPos.X].object = selectedChess;
  /*プレイヤーマネージャーに保存していた選択中の駒の移動マップの更新*/
  updateAreaMap(scene);
  // selectedChess.areaMap = MoveArea.getAreaMap(nextPos.X,nextPos.Y,selectedChess);
  /*プレイヤーマネージャーに保存していた選択中の駒を初期化*/
  selectedChess = "";

}
export function updateAreaMap(scene){
  let tilePropArr = scene.StageManager.tilePropMap;
  let MoveArea    = scene.StageManager.MoveArea;

  for(var i = 0; i < tilePropArr.length;i++){
    for(var k = 0; k < tilePropArr[i].length;k++){
      if(tilePropArr[i][k].object !== ""){

        tilePropArr[i][k].object.areaMap = MoveArea.getAreaMap(k,i,tilePropArr[i][k].object);

      }
    }
  }
}
/*==============================
ステージにトラップのプロパティ変更
==============================*/    
export function setPropitem(config){
  let scene = config.scene;
  let selecteditem = config.selecteditem
  let index = config.index;
  let nextPos = config.nextPos;
  let pos = getTilePositionNumber(nextPos.X,nextPos.Y,scene);
  let itemGroup;
  if(scene.registry.list.gameMode !== "NET"){
    if(scene.StageManager.STATUS.TURN === 'player1'){
      itemGroup = scene.itemManager.itemPlayer1Group;
    }
    if(scene.StageManager.STATUS.TURN === 'player2'){
      itemGroup = scene.itemManager.itemPlayer2Group;
    }
  }else{
    itemGroup = scene.itemManager.itemPlayer1Group;
  }

  /*トラップの設置後はタッチイベント削除*/
  selecteditem.removeInteractive();

  /*トラップの位置をステージに配置*/
  itemGroup.children.entries[index].x = pos.world.x;
  itemGroup.children.entries[index].y = pos.world.y;
  itemGroup.children.entries[index].pos.X = nextPos.X;
  itemGroup.children.entries[index].pos.Y = nextPos.Y;
  scene.StageManager.tilePropMap[nextPos.Y][nextPos.X].item = selecteditem;

  /*プレイヤーマネージャーに保存していた選択中のトラップを初期化*/
  scene.PlayerManager.selecteditem = "";

}
