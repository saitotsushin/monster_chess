/*==============================
ステージの初期化
==============================*/    
export function initStage(stageArr){
  for(var i = 0; i < stageArr.length; i++){//縦：y
    for(var k = 0; k < stageArr[i].length; k++){//横：x
      stageArr[i][k] = {
        object: "",
        trap: "",
        groundType: ""
      };
    }
  }
}

export function initiGroudType(stageArr,map){
  for(var i = 0; i < stageArr.length; i++){//縦：y
    for(var k = 0; k < stageArr[i].length; k++){//横：x
      stageArr[i][k].groundType = map[i][k];
    }
  }
}