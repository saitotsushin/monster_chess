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

  //移動できる＆攻撃できる場所の一覧をリストアップする。
  let node_list = getNodeList(EnemyChesses);

  /*
  もし、指定したターン数内の検索で攻撃対象がいない場合、
  ランダムで駒を選んで相手の駒の一番近くに設置する
  */
  if(node_list.length === 0){
    //#TODO
    console.log("攻撃できる相手がいません")
  }else{
    //抽出したリストに点数付けする
    let eval_list = calcEval(node_list);

    //一番評価が高い値のオブジェクトを抽出する
    let evalMost_list = getMostEval(eval_list);

    console.log("evalMost_list",evalMost_list)

  }


}
/*==============
移動できる＆攻撃できる場所の一覧をリストアップする関数
==============*/
export function getNodeList(EnemyChesses){
  let node_list = [];
  let chess;
  let canPutObjectList;
  for (var i = 0; i < EnemyChesses.length; i++) {
    
    chess = EnemyChesses[i];

    //移動エリアの保存
    chessArea = chess.areaMap;

    //移動エリア内で探しに行く。
    canPutObjectList = canMove(chess,'start');

    //検索結果を保存
    if (canPutObjectList.length > 0) {
      for(var k = 0; k < canPutObjectList.length; k++){
        node_list.push(canPutObjectList[k]);
      }
    }
    //リセット
    nodeObjectList = [];
    thinkTurnCount = thinkTurnCount_init;
  }
  return node_list;
}
/*==============
攻撃できるか判定
==============*/
export function canMove(chess,mode){

  //再帰関数の確認用 start
  if(mode === "recursive"){
    /*
    再帰関数のループを確認する時ここを使う
    */
  }
  //再帰関数の確認用 end

  let areaMap = chess.areaMap;

  //オブジェクトの形
  let canAttackList = [];
  
  for(var i = 0; i < areaMap.length; i++){
    for(var k = 0; k < areaMap[i].length; k++){
      if(areaMap[i][k] === 1 || areaMap[i][k] === 9){
        //移動後の移動エリアを更新
        chess.areaMap = MoveArea.getAreaMap(k,i,chess)
        //攻撃できるか判定
        canAttackList = canAttack(chess,k,i);
        for(var l = 0; l < canAttackList.length; l++){
          //9（移動なしで攻撃可能の場合はターン数を-1
          if(areaMap[i][k] === 9){
            canAttackList[l].useTurn -= 1;
          }
          nodeObjectList.push(canAttackList[l]);
        }
      }
    }
  }

  //再帰関数：攻撃する駒がなかったら指定のターン数先まで繰り返す。
  if(thinkTurnCount < thinkTurn){
    thinkTurnCount++;//指定のターン数のカウントアップ
    canMove(chess,"recursive");//recursive->再帰
  }

  //再帰関数が終わったら取得した配列を返す。
  return nodeObjectList;
}

/*==============
攻撃できるか判定
==============*/
export function canAttack(chess,_X,_Y){
  let areaMap = chess.areaMap;
  let nodeObject = {};
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
    mode: "",
    -------
    移動先
    int: {
      X: _X,
      Y: _Y
    }
    -------
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
            //オブジェクトの保存
            nodeObject = {
              name: chess.name,
              chess: chess,//駒
              eval: 0,//評価値
              attackedPerHp: 1 - simulateDestroyPer,
              useTurn: thinkTurnCount,
              mode: "ATTACK",
              int: {
                X: _X,
                Y: _Y
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
  for(var i = 0; i < node_list.length;i++){
    //攻撃相手の残りHPのパーセント + (検索するターン数 - ターン数)
    point = node_list[i].attackedPerHp + (thinkTurn - node_list[i].useTurn)
    node_list[i].eval = point;
  }
  eval_list = node_list;

  return eval_list;

}
export function getMostEval(eval_list){

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

  return eval_most_list;

}


/*==============
AIにとって一番点数の高い盤になる次の一手を探索する。（使わない）
==============*/
export function deepThinkAllAB(scene){
  console.log("searchArea",scene)
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