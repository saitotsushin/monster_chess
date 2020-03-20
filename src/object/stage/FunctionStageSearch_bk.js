/*==============
関数のスコープ内で使う変数
==============*/
let tilePropMap;
let EnemyChesses;
let MoveArea;
let thinkTurn = 2;//何ターン先まで検索するか
let thinkTurnCount = 1;//カウント用
let thinkTurnCount_init = 1;//カウントのリセット用
let nodeObjectList = [];//再帰関数用にスコープ内にもつ
let mostEvalChess;
let parentNodeChess = {
  object: "",
  pos:{
    X: 0,
    Y: 0  
  },
  eval: 0
};
//駒の移動エリアの一時保存用
let chessArea = [
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0]
];
/*==============
AIの本体
==============*/
export function thinkAI(scene){
  //使用するデータをスコープ内に保存
  tilePropMap = scene.StageManager.StageData.tilePropMap;
  EnemyChesses = scene.PlayerManager.player2ChessGroup.children.entries;
  MoveArea = scene.StageManager.MoveArea;

  //移動できる一覧をリストアップする。
  let node_list = getNodeList(EnemyChesses);
  let afterDeepThink = deepThink(node_list)

}
/*==============
移動できる＆攻撃できる場所の一覧をリストアップする関数
==============*/

export function getNodeList(EnemyChesses){

  let areaMap;

  let node_list = [];

  let chessObject = {};

  for(var n = 0; n < EnemyChesses.length; n++){
    areaMap = EnemyChesses[n].areaMap;
    for(var i = 0; i < areaMap.length; i++){
      for(var k = 0; k < areaMap[i].length; k++){
        if(areaMap[i][k] === 1 || areaMap[i][k] === 3 || areaMap[i][k] === 9){
          if(tilePropMap[i][k].object === "" || tilePropMap[i][k].object.name === EnemyChesses[n].name){
            chessObject = {
              chess: EnemyChesses[n],
              name: EnemyChesses[n].name,
              pos:{
                X: k,
                Y: i  
              }
            }
            node_list.push(chessObject);
          }
        }
      }
    }
  
  }
  return node_list;
}
/*==============
検索
==============*/
export function deepThink(node_list){
  let get_node_list = [];
  let chess;
  let canPutObject;
  let pos;
  for (var i = 0; i < node_list.length; i++) {
    
    chess = node_list[i].chess;
    pos = node_list[i].pos;

    
    //移動エリアの保存
    chessArea = chess.areaMap;

    //移動エリア内で探しに行く。
    canPutObject = canMove(chess,thinkTurnCount,pos);

    parentNodeChess = {
      object: "",
      pos: {
        X: 0,
        Y: 0
      },
      eval: 0
    };

    get_node_list.push(canPutObject)

  }
  return get_node_list;
}
/*==============
攻撃できるか判定
==============*/
export function canMove(chess,count,pos){

  //再帰関数の確認用 start
  if(count !== 0){
    /*
    再帰関数のループを確認する時ここを使う
    */
  }
  //再帰関数の確認用 end
  // let areaMap = chess.areaMap;
  let areaMap = MoveArea.getAreaMap(pos.X,pos.Y,chess)

  //チェック用
  let canAttackList = [];

  let thinkTurnCount = count;
  
  for(var i = 0; i < areaMap.length; i++){
    for(var k = 0; k < areaMap[i].length; k++){
      if(areaMap[i][k] === 1 || areaMap[i][k] === 9){
        //移動後の移動エリアを更新
        // chess.areaMap = MoveArea.getAreaMap(k,i,chess)
        //攻撃できるか判定
        canAttackList = canAttack(chess,thinkTurnCount);
        if(areaMap[i][k] === 9){
          for(var l = 0; l < canAttackList.length; l++){
            //9（移動なしで攻撃可能の場合はターン数を-1
            canAttackList[l].useTurn -= 1;
            if(canAttackList[l].useTurn === 0){
              
            }
          }
        }
        //一覧に入った駒を全て評価する
        let calcedList = calcEval(canAttackList);

        //一番評価が高い駒を抽出して、親の評価に追加する
        mostEvalChess = getMostEvalChess(calcedList)

        if(parentNodeChess.object !== ""){
          //初期値より高かったら更新する。
          if(parentNodeChess.eval < mostEvalChess.eval){
            parentNodeChess.eval = mostEvalChess.eval;
          }
        }else{
          //初期値を登録
          parentNodeChess.object = mostEvalChess;
          parentNodeChess.eval = mostEvalChess.eval;
          parentNodeChess.pos.X = pos.X;
          parentNodeChess.pos.Y = pos.Y;
        }
        if(thinkTurnCount === thinkTurn){
          nodeObjectList.push(parentNodeChess);
        }
        canAttackList = [];

        let nextPos = {
          X: k,
          Y: i
        };

        //再帰関数：攻撃する駒がなかったら指定のターン数先まで繰り返す。
        if(thinkTurnCount < thinkTurn){
          thinkTurnCount++;//指定のターン数のカウントアップ
          canMove(chess,thinkTurnCount,nextPos);//recursive->再帰
        }
      }
    }
  }

  nodeObjectList = [];
  thinkTurnCount = thinkTurnCount_init;

  //再帰関数が終わったら駒を返す。
  return parentNodeChess;
}

/*==============
攻撃できるか判定
==============*/
export function canAttack(chess,count){

  let areaMap = chess.areaMap;
  // let nodeObject;
  let nodeObject = {
    name: chess.name,
    chess: chess,//駒
    eval: 0,//評価値
    attackedPerHp: 1,
    useTurn: count,
    mode: "MOVE"
  } 
  /*
  **オブジェクトの形**
  let nodeObject = {
    -------
    chessのname（name=keyを登録している）
      ->コンソールでわかりやすくするため
    name: "", 
    -------
    駒
    chess: "",
    -------
    評価値
    eval: 0,  
    -------
    攻撃した時に相手のHPの残りが少ないほど1に近くする->高評価
    attackedPerHp: 1 - simulateDestroyPer,
    -------
    何ターン後か
    useTurn: thinkTurnCount,
    -------
    攻撃->ATTACK | 移動->MOVE
    mode: ""
  }
  */
  let nodeObjectList = []; 
  let simulateDestroyPer = 0;
  let playerType = "";
  let enemyType = "";
  for(var i = 0; i < areaMap.length; i++){
    for(var k = 0; k < areaMap[i].length; k++){
      if(areaMap[i][k] === 2 || areaMap[i][k] === 3){
        if(tilePropMap[i][k].object !== ""){

          playerType = tilePropMap[i][k].object.playerType;
          enemyType = chess.playerType;

          if(playerType !== enemyType){
            //攻撃した時の相手のHPの残りをパーセントで返す。
            simulateDestroyPer = simulatBattle({
              playerChess: tilePropMap[i][k].object,
              enemyChess: chess
            });

            nodeObject.attackedPerHp= 1 - simulateDestroyPer;
            nodeObject.mode= "ATTACK";

            nodeObjectList.push(nodeObject);
          }
        }
      }
    }
  }
  if(nodeObjectList.length === 0){
    nodeObjectList.push(nodeObject);    
  }

  return nodeObjectList;
}

/*==============
抽出したリストに点数付けする関数
==============*/
export function calcEval(node_list){

  let eval_list = [];
  let point = 0;
  for(var i = 0; i < node_list.length;i++){
    //攻撃相手の残りHPのパーセント + (検索するターン数 - ターン数)
    point = node_list[i].attackedPerHp + (thinkTurn - node_list[i].useTurn)
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
AIにとって一番点数の高い盤になる次の一手を探索する。（使わない）
==============*/
export function deepThinkAllAB(scene){
}

/*==============
便利系
==============*/
export function simulatBattle(objects){
  let playerChess = objects.playerChess;
  let enemyChess = objects.enemyChess;
  let simulateDamage = 0;
  let baseHp = playerChess.status.hp;
  let maxHp = playerChess.status.maxHp;
  let simulateDestroyPer = 0;//攻撃した時の相手の残りHPを％で返す。
  let damage = enemyChess.status.power - playerChess.status.difence;
  if(damage <= 0){
    damage = 0;
  }

  baseHp -= damage;

  simulateDestroyPer = baseHp / maxHp;
  

  return simulateDestroyPer;
  
}