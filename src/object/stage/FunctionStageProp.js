
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
export function setProp(scene){
  let player1_Arr = scene.PlayerManager.player1_Arr;
  let player2_Arr = scene.PlayerManager.player2_Arr;
  let player1ChessGroup = scene.PlayerManager.player1ChessGroup.children.entries;
  let player2ChessGroup = scene.PlayerManager.player2ChessGroup.children.entries;
  let tilePropArr = scene.StageManager.tilePropMap;
  let MoveArea = scene.StageManager.MoveArea;

  for(var i = 0; i < player1_Arr.length;i++){
    for(var k = 0; k < player1_Arr[i].length;k++){
      if(player1_Arr[i][k] !== 0){

        tilePropArr[i][k].object = player1ChessGroup[player1_Arr[i][k]-1];
        tilePropArr[i][k].object.areaMap = MoveArea.getAreaMap(k,i,player1ChessGroup[player1_Arr[i][k]-1]);

      }
    }
  }
  for(var i = 0; i < player2_Arr.length;i++){
    for(var k = 0; k < player2_Arr[i].length;k++){
      if(player2_Arr[i][k] !== 0){

        tilePropArr[i][k].object = player2ChessGroup[player2_Arr[i][k]-1];
        tilePropArr[i][k].object.areaMap = MoveArea.getAreaMap(k,i,player2ChessGroup[player2_Arr[i][k]-1]);

      }
    }
  }
}
/*==============================
ステージにチェスのプロパティ変更
==============================*/    
export function updateStageProps(scene){
  let StageManager    = scene.StageManager;
  let beforePos       = StageManager.beforeChessPos;
  let nextPos         = StageManager.nextChessPos;
  let selectedChess   = scene.PlayerManager.selectedChess;
  let MoveArea        = StageManager.MoveArea;

  /*前の駒をステージから削除*/
  scene.StageManager.tilePropMap[beforePos.Y][beforePos.X].object = "";
  /*移動する駒をステージに追加*/
  scene.StageManager.tilePropMap[nextPos.Y][nextPos.X].object = selectedChess;
  /*プレイヤーマネージャーに保存していた選択中の駒の移動マップの更新*/
  selectedChess.areaMap = MoveArea.getAreaMap(nextPos.X,nextPos.Y,selectedChess);

  /*プレイヤーマネージャーに保存していた選択中の駒を初期化*/
  selectedChess = "";

}
/*==============================
ステージにトラップのプロパティ変更
==============================*/    
export function setPropTrap(scene){
  let StageManager    = scene.StageManager;
  let index           = scene.PlayerManager.selectedTrap.groupIndex;
  let nextPos         = StageManager.nextChessPos;
  let selectedTrap   = scene.PlayerManager.selectedTrap;
  let pos = getTilePositionNumber(nextPos.X,nextPos.Y,scene);

  /*トラップの設置後はタッチイベント削除*/
  selectedTrap.removeInteractive();

  /*トラップの位置をステージに配置*/
  scene.TrapManager.trapGroup.children.entries[index].x = pos.world.x;
  scene.TrapManager.trapGroup.children.entries[index].y = pos.world.y;
  scene.StageManager.tilePropMap[nextPos.Y][nextPos.X].trap = selectedTrap;

  /*プレイヤーマネージャーに保存していた選択中のトラップを初期化*/
  scene.PlayerManager.selectedTrap = "";
}
