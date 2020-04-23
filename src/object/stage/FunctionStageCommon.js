

/*==============
相手の駒を全て配列に入れておく。
==============*/
export function getPlayerChessArr(tilePropMap,player){
  /*
  | 受け取る引数      |
  | tilePropMap | ステージタイルのプロパティ | 
  | player          | "player1" or "player2" |
  */

  let arr = [];
  for(var i = 0; i < tilePropMap.length; i++){
    for(var k = 0; k < tilePropMap[i].length; k++){
      if(tilePropMap[i][k].object.playerType === player){
        arr.push({
          object: tilePropMap[i][k].object,
          X: k,
          Y: i,
          moveX: 0,
          moveY: 0
        })
      }
    }
  }
  return arr;
}

/*==============
共通で呼ばれる関数
==============*/
export function getCanAttackChess(chess,player1ChessArr,pos,moveArea){
  let checkArr = [];
  let moveArr = [
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
  ];
  if(pos){
    moveArr = moveArea.setArrPosition(
      pos.X,
      pos.Y,
      chess
    );

  }else{
    moveArr = chess.areaMap;
  }

  for(var i = 0; i < player1ChessArr.length; i++){
    if(moveArr[player1ChessArr[i].Y][player1ChessArr[i].X] === 2 
      || moveArr[player1ChessArr[i].Y][player1ChessArr[i].X] === 3 ){

      let count = pos ? 1 : 0;//1回目（攻撃）：２回目（移動->攻撃）

      player1ChessArr[i].moveX = pos ? pos.X : 0;
      player1ChessArr[i].moveY = pos ? pos.Y : 0;

      let evaluationPoint = CalcEvaluation.getPoint(chess,player1ChessArr[i].object,count)
      
      checkArr.push({ 
        object: chess,
        target: player1ChessArr[i],
        evaluationPoint: evaluationPoint
      })
    }
  }

  if(checkArr.length > 0){
    return checkArr;
  }else{
    return;
  }
}

// export function updateTileProp(data){
//   let beforePos = data.beforePos;
//   let afterPos  = data.afterPos;
//   let tilePropMap = data.tilePropMap;
//   let moveArea  = data.moveArea;
//   let chess     = data.chess;
//   let areaMap   = data.chess.areaMap;

//   //ステージデータの更新
//   tilePropMap[beforePos.Y][beforePos.X].object = "";
//   tilePropMap[afterPos.Y][afterPos.X].object = chess;

//   //移動エリアデータの更新
//   areaMap = moveArea.setArrPosition(afterPos.X,afterPos.Y,chess,"MOVE");
// }


// export function checkTrap(chess,tilePropMap,pos,scene){

//   let trap = tilePropMap[pos.Y][pos.X].trap;

//   let trapObject;


//   if(trap){

//     trap.damage(chess,pos);

//     tilePropMap[pos.Y][pos.X].trap = "";

//     trapObject = scene.trap.trapGroup.children.entries[trap.groupIndex];
//     trapObject.destroy();
//   }

// }
