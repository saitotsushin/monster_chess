/*==============================
ステージにプロパティ追加
==============================*/    
export function setProp(scene){
  let player1_Arr = scene.PlayerManager.player1_Arr;
  let player2_Arr = scene.PlayerManager.player2_Arr;
  let player1ChessGroup = scene.PlayerManager.player1ChessGroup.children.entries;
  let player2ChessGroup = scene.PlayerManager.player2ChessGroup.children.entries;
  let tilePropArr = scene.StageManager.tilePropertyArr;

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
}
/*==============================
ステージにチェスのプロパティ変更
==============================*/    
export function setPropChess(scene){
  let StageManager    = scene.StageManager;
  let beforePos       = StageManager.beforeChessPos;
  let nextPos         = StageManager.nextChessPos;
  let selectedChess   = scene.PlayerManager.selectedChess;
  /*前の駒をステージから削除*/
  scene.StageManager.tilePropertyArr[beforePos.Y][beforePos.X].object = "";
  /*移動する駒をステージに追加*/
  scene.StageManager.tilePropertyArr[nextPos.Y][nextPos.X].object = selectedChess;
  /*プレイヤーマネージャーに保存していた選択中の駒を初期化*/
  scene.PlayerManager.selectedChess = "";
}
/*==============================
ステージにトラップのプロパティ変更
==============================*/    
export function setPropTrap(scene){
  let StageManager    = scene.StageManager;
  let index           = scene.PlayerManager.selectedTrap.groupIndex;
  let nextPos         = StageManager.nextChessPos;
  let selectedTrap   = scene.PlayerManager.selectedTrap;
  let pos = StageManager.getTilePositionNumber(nextPos.X,nextPos.Y);

  /*トラップの設置後はタッチイベント削除*/
  selectedTrap.removeInteractive();

  /*トラップの位置をステージに配置*/
  scene.TrapManager.trapGroup.children.entries[index].x = pos.world.x;
  scene.TrapManager.trapGroup.children.entries[index].y = pos.world.y;
  scene.StageManager.tilePropertyArr[nextPos.Y][nextPos.X].trap = selectedTrap;

  /*プレイヤーマネージャーに保存していた選択中のトラップを初期化*/
  scene.PlayerManager.selectedTrap = "";
}
