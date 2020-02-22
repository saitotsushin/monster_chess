import * as Func from '../common/Func';
import * as StageFunc from './StageFunc';

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
/*==============================
ステージの初期化
==============================*/    
export function initStage(stageArr){
  for(var i = 0; i < stageArr.length; i++){//縦：y
    for(var k = 0; k < stageArr[i].length; k++){//横：x
      stageArr[i][k] = {
        object: "",
        trap: ""
      };
    }
  }
}
/*==============================
駒の初期化
==============================*/    
export function initSetChess(group,stageArr,moveArea,stageProp,scene){
  let pos = {
    x: 0,
    y: 0
  };
  let count = 0;
  let index;
  console.log("stageArr",stageArr)
  for(var i = 0; i < stageArr.length; i++){//縦：y
    for(var k = 0; k < stageArr[i].length; k++){//横：x
      if(stageArr[i][k] !== 0){
        index = stageArr[i][k] - 1;
        pos = stageProp.getPositionNumber(k,i);
        console.log("pos___",pos)
        group.children.entries[index].x = pos.x;
        group.children.entries[index].y = pos.y;
        group.children.entries[index].areaArr = moveArea.setArrPosition(k,i,group.children.entries[index]);
        StageFunc.setProperty(scene,k,i,"object",group.children.entries[index]);          
        count++;
      }
    }
  }
}