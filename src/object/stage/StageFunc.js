import * as CalcEvaluation from './CalcEvaluation';
import * as Func from '../common/Func';

export function setProperty(scene,x,y,prop,data){
  let stageArr = scene.stageData.tilePropertyArr[y][x];

  switch(prop){
    case 'object':
      stageArr.object = data;
      break;
    case 'trap':
      stageArr.trap = data;
      break;
    default:
  }
}
/*==============
相手の駒を全て配列に入れておく。
==============*/
export function player1ChessArr(stageData){
  let arr = [];
  for(var i = 0; i < stageData.tilePropertyArr.length; i++){
    for(var k = 0; k < stageData.tilePropertyArr[i].length; k++){
      if(stageData.tilePropertyArr[i][k].object.type === "player1"){
        arr.push({
          object: stageData.tilePropertyArr[i][k].object,
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
    moveArr = chess.areaArr;
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
export function updateTileProp(config){
  let afterPosX  = config.afterPos.x || 0;
  let afterPosY  = config.afterPos.y || 0;
  let beforePosX = config.beforePos.x || 0;
  let beforePosY = config.beforePos.y || 0;
  let stageData  = config.stageData || "";
  let moveArea   = config.moveArea || "";
  let chess = config.chess || "";
  //ステージデータの更新
  stageData.tilePropertyArr[beforePosY][beforePosX].object = "";
  stageData.tilePropertyArr[afterPosY][afterPosX].object = chess;
  //移動エリアデータの更新
  chess.areaArr = moveArea.setArrPosition(afterPosX,afterPosY,chess,"MOVE");
}
export function checkTrap(chess,tilePropertyArr,pos,scene){


  let trap = tilePropertyArr[pos.Y][pos.X].trap;

  let trapObject;


  if(trap){

    trap.damage(chess,pos);

    tilePropertyArr[pos.Y][pos.X].trap = "";

    trapObject = scene.trap.trapGroup.children.entries[trap.groupIndex];
    trapObject.destroy();
  }

}