import * as CalcEvaluation from './CalcEvaluation';
import * as Func from '../common/Func';
import * as StageFunc from './StageFunc';

/*==============
相手の駒を全て配列に入れておく。
==============*/
export function random(config){
  let group = config.group || "";
  let beforeChessPos = config.beforeChessPos || "";
  let stageProp = config.stageProp || "";
  let stageData = config.stageData || "";
  let scene = config.scene || "";
  let moveArea = config.moveArea || "";
  //ランダムでchessを選ぶ
  let groupLength = group.length;
  let moveRandom = Func.getRandomInt(0,groupLength-1);
  let moveChess = group[moveRandom];
  let moveChessBeforePos = stageProp.getPositionInt(moveChess.x,moveChess.y);
  beforeChessPos.x = moveChessBeforePos.X;
  beforeChessPos.y = moveChessBeforePos.Y;

  let moveNextArr = [];

  let moveNextSavePos = {
    X: 0,
    Y: 0
  };

  let moveNextPos;

  for(var i = 0; i < moveChess.areaArr.length; i++){
    for(var k = 0; k < moveChess.areaArr[i].length; k++){
      if(stageData.tilePropertyArr[i][k].object === ""){
        if(moveChess.areaArr[i][k] === 1 || moveChess.areaArr[i][k] === 3){
          moveNextSavePos.X = k;
          moveNextSavePos.Y = i;
          moveNextArr.push(moveNextSavePos);
        }
      }
    }
  }

  moveNextPos = moveNextArr[Func.getRandomInt(0,moveNextArr.length-1)];
  moveChess.move(moveNextPos.X,moveNextPos.Y,moveChess);
  StageFunc.checkTrap(
    moveChess,
    scene.stageData.tilePropertyArr,
    stageProp.getPositionInt(moveChess.x,moveChess.y),
    scene
  );

  StageFunc.updateTileProp(
    {
      afterPos: {
        x: moveNextPos.X,
        y: moveNextPos.Y,
      },
      beforePos: {
        x: beforeChessPos.x,
        y: beforeChessPos.y,
      },
      stageData: stageData,
      moveArea: moveArea,
      chess: moveChess
    }
  );
}
