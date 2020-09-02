/*==============
関数のスコープ内で使う変数
==============*/
let MoveArea;
let thinkTurn = 2;//何ターン先まで検索するか
let thinkTurnCount = 1;//カウント用

let NOW_TURN;

let player1 = {
  chessGroup: "",
  chessMap: "",
  itemGroup: ""
}
let itemMap;
let itemMap2;
let player2 = {
  chessGroup: "",
  chessMap: "",
  itemGroup: ""
}
let _scene;

/*==============
AIの本体
==============*/
export function thinkAI(scene){
  _scene = scene;
  itemMap = scene.itemMap;
  itemMap2 = scene.itemMap2;
  //使用するデータをスコープ内に保存
  player1.chessGroup = scene.GameManager.playerChessGroup.children.entries;
  player2.chessGroup = scene.GameManager.playerChessGroup2.children.entries;
  /*自分のデータ*/
  player1.chessMap = scene.chessMapData;
  player1.itemGroup = scene.GameManager.playerItemGroup.children.entries;
  /*相手のデータ*/
  player2.chessMap = scene.chessMapData2;
  player2.itemGroup = scene.GameManager.playerItemGroup2.children.entries;
  let setting_movearea;


  MoveArea = scene.GameManager.StageManager.MoveArea;

  /*現状のareaMapを更新*/
  for(var i = 0; i < player2.chessGroup.length; i++){
    setting_movearea = {
      pos   : player2.chessGroup[i].tilePos,
      chess : player2.chessGroup[i],
      mapAll: scene.GameManager.stageMapAll,
      map   : scene.chessMapData,
      map2  : scene.chessMapData2
    };
    player2.chessGroup[i].areaMap = MoveArea.getAreaMap(setting_movearea)
  }


  //移動できる一覧をリストアップする。
  let node_list = getNodeList();

  let afterDeepThink = deepThinkNodes(node_list);

  let evaledList = [];
  let evaled;

  for(var i = 0; i < afterDeepThink.length;i++){
    evaled = calcEval(afterDeepThink[i]);
    for(var n = 0; n < evaled.length; n++){
      evaledList.push(evaled[n]);
    }
  }

  let selectedChess;


  if(evaledList.length > 0){
    //移動する
    selectedChess = getMostEvalChess(evaledList);
    
  }else{
    //一番攻撃力の高い駒を一番防御力の低い駒の近くに移動させる
    selectedChess = getChaseEnemy(player2.chessGroup,player1.chessGroup);

  }

  return selectedChess;

}
/*==============
移動できる＆攻撃できる場所の一覧をリストアップする関数
==============*/

export function getNodeList(){

  let areaMap;

  let node_list = [];

  let node = {};

  let chessGroup = player2.chessGroup;
  let itemGroup  = player2.itemGroup;


  let setStatus = "";//MOVE or STAY
  
  for(var n = 0; n < chessGroup.length; n++){
    areaMap = chessGroup[n].areaMap;
    for(var i = 0; i < areaMap.length; i++){
      for(var k = 0; k < areaMap[i].length; k++){

        if(areaMap[i][k] === 1 || areaMap[i][k] === 3 || areaMap[i][k] === 9){
          if(itemMap2[i][k] !== 0){
            /*移動先に、
            トラップがあって　かつ　攻撃タイプだったらcontinueで次へ進む。
            */
            let itemIndex = itemMap2[i][k];
            let item = itemGroup[itemIndex - 1];
            if(item.itemTYPE === 'ATTACK'){
              continue;
            }
          }
          if(areaMap[i][k] === 9){
            setStatus = "STAY";
          }else{
            setStatus = "MOVE";
          }
          node = {
            current: {
              chess: chessGroup[n],
              pos:{
                X: k,
                Y: i  
              },
              status: setStatus
            },
            name: chessGroup[n].frame,
            list: []
          }
          node_list.push(node);
        }
      }
    }
  
  }

  return node_list;
}
/*==============
検索：移動範囲ごとに検索
==============*/
export function deepThinkNodes(node_list){
  let get_node_list = [];
  let set_node_list = [];
  for (var i = 0; i < node_list.length; i++) {
    get_node_list = deepThink(node_list[i]); 
    if(get_node_list.length > 0){
      set_node_list.push(get_node_list);   
    }
  }
  return set_node_list;
}
/*==============
検索
==============*/
export function deepThink(node){

  let _node = node;
  let _chess = _node.current.chess;
  let status = _node.current.status;
  let _pos = _node.current.pos;

  //移動後の移動エリアを更新
  let setting_movearea = {
    pos   : _pos,
    chess : _chess,
    mapAll: _scene.GameManager.stageMapAll,
    map   : _scene.chessMapData2,
    map2  : _scene.chessMapData
  };  
  let areaMap = MoveArea.getAreaMap(setting_movearea);
  //攻撃できるか判定  
  let movedList = [];
  movedList = checkAttackMap(_chess,areaMap,_pos);
  let movedList2 = [];

  //移動が必要なし
  if(status === "STAY"){
    for(var i = 0; i < movedList.length; i++){
      let nodeObject = movedList[i];
      nodeObject.useTurn--;
      nodeObject.mode = "ATTACK";
      movedList2.push(nodeObject)
    }
  }else{
    movedList2 = movedList;
  }
  return movedList2;

}


/*==============
移動後に攻撃できるか
==============*/
export function checkAttackMap(chess,areaMap,pos){

  // let nodeObject = {} 
  let nodeObjectList = []; 
  let simulateDestroyPer = 0;
  let _playerChess2 = chess;
  let _pos1 = {
    X: 0,
    Y: 0
  }
  let _pos2 = pos;
  let _chess = chess;

  for(var i = 0; i < areaMap.length; i++){
    for(var k = 0; k < areaMap[i].length; k++){
      if(areaMap[i][k] === 2 || areaMap[i][k] === 3){
        if(player1.chessMap[i][k] !== 0){
          _pos1.X = k;
          _pos1.Y = i;
          let _playerChess1 = _scene.GameManager.getChessFromPos(_pos1);
          if(_playerChess1){

            //攻撃した時の相手のHPの残りをパーセントで返す。
            simulateDestroyPer = simulatBattle({
              playerChess1: _playerChess1,
              playerChess2: _playerChess2
            });
  
            let nodeObject = {
              chess: _chess,//駒
              name: chess.name,
              mode: "ATTACK",
              attackTarget: _playerChess1,
              attackTargetName: _playerChess1.name,
              eval: 0,
              useTurn: thinkTurnCount,
              attackedPerHp: simulateDestroyPer,
              tilePos: {
                X: _pos2.X,
                Y: _pos2.Y
              }
            } 
  
            nodeObjectList.push(nodeObject);
          }

          // }
        }
      }
    }
  }

  return nodeObjectList;    

}

/*==============
抽出したリストに点数付けする関数
==============*/
export function calcEval(node_list){

  let eval_list = [];
  let point = 0;
  //一旦、リセット
  for(var i = 0; i < node_list.length; i++){
    node_list[i].eval = 0;
  } 
  for(var i = 0; i < node_list.length;i++){
    //攻撃相手の残りHPのパーセント + (検索するターン数 - ターン数)
    point = (1 - node_list[i].attackedPerHp) + (thinkTurn - node_list[i].useTurn)
    node_list[i].eval = point;
  }
  
  eval_list = node_list;

  return eval_list;

}
export function getMostEvalChess(eval_list){

  let eval_check_list = [];//一時保存用
  let eval_most_list = [];//returnする配列
  let point = eval_list[0].eval;
 
  for(var i = 0; i < eval_list.length; i++){
    if(point <= eval_list[i].eval){
      point = eval_list[i].eval;
      eval_check_list.push(eval_list[i]);
    }
  }
  /*
  最後に追加された値と再度比べ直す。
   -> 一件目と同じ値も入っているため
  */
  let lastNumb = 0;
  let lastPoint = 0;
  if(eval_check_list.length > 0){
    lastNumb = eval_check_list.length - 1;
    lastPoint = eval_check_list[lastNumb].eval;
    for(var i = 0; i < eval_check_list.length; i++){
      if(lastPoint <= eval_check_list[i].eval){
        eval_most_list.push(eval_check_list[i]);
      }
    }
  }else{
    eval_most_list.push(eval_list[0]);
  }


  return eval_most_list[0];

}

/*==============
一番攻撃力の高い駒を取得する
==============*/
export function getHighestPowerChess(chesses){
  let moveChess;
  let attackPoint = 0;

  for(var i= 0; i < chesses.length; i++){
    if(attackPoint <= chesses[i].status.power){
      attackPoint = chesses[i].status.power;
      moveChess = chesses[i];
    }
  }
  return moveChess;
}
/*==============
一番HPの低い駒を取得する
==============*/
export function getSmallestDifenceChess(chesses){
  let difenceChess;
  let hpPoint = chesses[0].status.hp;

  for(var i= 0; i < chesses.length; i++){
    if(hpPoint >= chesses[i].status.hp){
      hpPoint = chesses[i].status.hp;
      difenceChess = chesses[i];
    }
  }
  if(!difenceChess){
    difenceChess = chesses[0];
  }
  return difenceChess;
}
/*==============
何も攻撃対象がない時の移動
一番攻撃力の高い駒が一番防御力の低い駒に近づく。
==============*/
export function getChaseEnemy(enemyChessGroup,playerChessGroup){
  let moveChess = getHighestPowerChess(enemyChessGroup);
  let attackChess = getSmallestDifenceChess(playerChessGroup);

  let sa_X = 0;
  let sa_Y = 0;
  let sum = 0;
  let sum_diff = 0;
  let pl_pos_X = attackChess.tilePos.X;
  let pl_pos_Y = attackChess.tilePos.Y;
  let list = {};
  let savePos = {
    X: 0,
    Y: 0
  }
  
  let map = moveChess.areaMap;
  for(var i = 0; i < map.length; i++){
    for(var k = 0; k < map[i].length; k++){
      if(itemMap2[i][k] !== 0){
        /*移動先に、
        トラップがあって　かつ　攻撃タイプだったらcontinueでスキップする。
        */
        let itemIndex = itemMap2[i][k];
        let item = player2.itemGroup[itemIndex - 1];
        if(item.itemTYPE === 'ATTACK'){
          continue;
        }
      }
      /*
      移動先にオブジェクトがある　かつ　自分以外だったら次へ進む。
      */
      if(map[i][k] === 0){
        continue;
      }

      if(map[i][k] === 1 || map[i][k] === 3){
        sa_X = pl_pos_X - k;
        sa_Y = pl_pos_Y - i;
        sum = sa_X + sa_Y;

        if(sum_diff === 0){
          sum_diff = sum;
        }

        if(sum_diff >= sum){
          sum_diff = sum;
          savePos.X = k;
          savePos.Y = i;
          list = savePos;
        }

      }
    }
  }

  let setObject = {
    chess: moveChess,
    name: moveChess.name,
    mode: 'MOVE',
    attackTarget: attackChess,
    attackTargetName: attackChess.name,
    tilePos: {
      X: list.X,
      Y: list.Y
    }
    
  }
  return setObject;

}
/*==============
便利系
==============*/
export function simulatBattle(objects){
  let playerChess = objects.playerChess1;
  let enemyChess  = objects.playerChess2;

  let baseHp = playerChess.status.hp;
  let maxHp = playerChess.status.maxHp;
  let simulateDestroyPer = 0;//攻撃した時の相手の残りHPを％で返す。
  let power = enemyChess.status.power;

  baseHp -= power;

  if(baseHp <= 0){
    simulateDestroyPer = 0;
  }else{
    simulateDestroyPer = baseHp / maxHp;
  }
  
  return simulateDestroyPer;
  
}