/*==============
関数のスコープ内で使う変数
==============*/
let tilePropMap;
let PlayerChesses;
let EnemyChesses;
let MoveArea;
let thinkTurn = 2;//何ターン先まで検索するか
let thinkTurnCount = 1;//カウント用

let NOW_TURN;

/*==============
AIの本体
==============*/
export function thinkAI(scene){
  //使用するデータをスコープ内に保存
  tilePropMap = scene.StageManager.StageData.tilePropMap;
  PlayerChesses = scene.PlayerManager.player1ChessGroup.children.entries;
  EnemyChesses = scene.PlayerManager.player2ChessGroup.children.entries;
  MoveArea = scene.StageManager.MoveArea;
  NOW_TURN = scene.StageManager.STATUS.TURN;

  //移動できる一覧をリストアップする。
  let node_list = getNodeList(EnemyChesses);

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
    selectedChess = getChaseEnemy(EnemyChesses,PlayerChesses);

  }

  return selectedChess;

}
/*==============
移動できる＆攻撃できる場所の一覧をリストアップする関数
==============*/

export function getNodeList(_EnemyChesses){

  let areaMap;

  let node_list = [];

  let node = {};

  let EnemyChesses = _EnemyChesses;

  let setStatus = "";//MOVE or STAY

  for(var n = 0; n < EnemyChesses.length; n++){
    areaMap = EnemyChesses[n].areaMap;
    for(var i = 0; i < areaMap.length; i++){
      for(var k = 0; k < areaMap[i].length; k++){

        if(areaMap[i][k] === 1 || areaMap[i][k] === 3 || areaMap[i][k] === 9){
          if(tilePropMap[i][k].item){
            /*移動先が、
            トラップがあって　かつ　攻撃タイプだったらcontinueでスキップする。
            */
            let item = tilePropMap[i][k].item;
            if(item.itemTYPE === 'ATTACK' && item.configuredPlayer === NOW_TURN){
              continue;
            }
  
          }
          //移動先にオブジェクトがある　かつ　自分以外だったら次へ進む。
          if(tilePropMap[i][k].object !== "" && tilePropMap[i][k].object.name !== EnemyChesses[n].name){
            continue;
          }
          if(areaMap[i][k] === 9){
            setStatus = "STAY";
          }else{
            setStatus = "MOVE";
          }
          node = {
            current: {
              chess: EnemyChesses[n],
              pos:{
                X: k,
                Y: i  
              },
              status: setStatus
            },
            name: EnemyChesses[n].name,
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
  console.log("node_list",node_list)
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
export function deepThink(node,count){
  let step = 0;
  if(count !== ''){
    step = count;
  };
  let _node = node;
  let _chess = _node.current.chess;
  let status = _node.current.status;
  let pos = _node.current.pos;

  console.log("_node",_node)

  //移動後の移動エリアを更新
  let areaMap = MoveArea.getAreaMap(pos.X,pos.Y,_chess)
  //攻撃できるか判定
  
  let movedList = [];
  movedList = checkAttackMap(_chess,areaMap,pos);
  let movedList2 = [];
  let nodeObject = {};

  let coun = 0;
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
  let playerType = "";
  let enemyType = "";
  let _chess = chess;
  let _pos = pos;

  for(var i = 0; i < areaMap.length; i++){
    for(var k = 0; k < areaMap[i].length; k++){
      if(areaMap[i][k] === 2 || areaMap[i][k] === 3){
        if(tilePropMap[i][k].object !== ""){

          console.warn("攻撃相手発見")

          playerType = tilePropMap[i][k].object.playerType;
          enemyType = chess.playerType;
          console.log("playerType",playerType)
          console.log("enemyType",enemyType)
          console.log("i="+i+"/k="+k)

          if(playerType !== enemyType){
            console.warn("攻撃相手発見")
            //攻撃した時の相手のHPの残りをパーセントで返す。
            simulateDestroyPer = simulatBattle({
              playerChess: tilePropMap[i][k].object,
              enemyChess: chess
            });

            let nodeObject = {
              chess: _chess,//駒
              name: chess.name,
              mode: "MOVE",
              attackTarget: tilePropMap[i][k].object,
              attackTargetName: tilePropMap[i][k].object.name,
              eval: 0,
              useTurn: thinkTurnCount,
              attackedPerHp: simulateDestroyPer,
              pos: {
                X: _pos.X,
                Y: _pos.Y
              }
            } 

            nodeObjectList.push(nodeObject);
          }
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
 let lastNumb = eval_check_list.length - 1;
  let lastPoint = eval_check_list[lastNumb].eval
  for(var i = 0; i < eval_check_list.length; i++){
    if(lastPoint <= eval_check_list[i].eval){
      eval_most_list.push(eval_check_list[i]);
    }
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
一番防御力の低い駒を取得する
==============*/
export function getSmallestDifenceChess(chesses){
  let difenceChess;
  let difencePoint = chesses[0].status.difence;

  for(var i= 0; i < chesses.length; i++){
    if(difencePoint >= chesses[i].status.difence){
      difencePoint = chesses[i].status.difence;
      difenceChess = chesses[i];
    }
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
  let pl_pos_X = attackChess.pos.X;
  let pl_pos_Y = attackChess.pos.Y;
  let list = {};
  let savePos = {
    X: 0,
    Y: 0
  }
  
  let map = moveChess.areaMap;
  for(var i = 0; i < map.length; i++){
    for(var k = 0; k < map[i].length; k++){
      if(tilePropMap[i][k].item){
        /*移動先が、
        トラップがあって　かつ　攻撃タイプだったらcontinueでスキップする。
        */
        let item = tilePropMap[i][k].item;
        if(item.itemTYPE === 'ATTACK' && item.configuredPlayer === NOW_TURN){
          continue;
        }

      }
      //移動先にオブジェクトがある　かつ　自分以外だったら次へ進む。
      if(tilePropMap[i][k].object !== ""){
        continue;
      }

      if(map[i][k] === 1){

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
    pos: {
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
  let playerChess = objects.playerChess;
  let enemyChess = objects.enemyChess;

  let baseHp = playerChess.status.hp;
  let maxHp = playerChess.status.maxHp;
  let simulateDestroyPer = 0;//攻撃した時の相手の残りHPを％で返す。
  let damage = enemyChess.status.power - playerChess.status.difence;
  if(damage <= 0){
    damage = 0;
  }

  baseHp -= damage;

  if(baseHp <= 0){
    simulateDestroyPer = 0;
  }else{
    simulateDestroyPer = baseHp / maxHp;
  }
  
  return simulateDestroyPer;
  
}