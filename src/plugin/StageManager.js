import MoveArea from './MoveArea';
import StageProp from '../utils/StageProp';

export default class StageManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;
    this.layer = gameScene.scene.stageLayer;
    this.map = gameScene.scene.map;
    this.selectedChess = "";
    this.enemyChess = "";
    this.mode = "";
    this.touchedPos = {
      x: 0,
      y: 0
    }
    this.beforeChessPos = {
      x: 0,
      y: 0
    }


    this.moveArea = new MoveArea({
      scene: this.scene,
      type: this.type,
      target: this
    });   
    this.stageProp = new StageProp({
      scene: this.scene
    });   
    this.gameStatus = "play";

    this.player1Count = 0;
    this.player2Count = 0;

  }
  /*==============================
  ステージの初期化
  ==============================*/    
  initStage(stageArr){
    for(var i = 0; i < stageArr.length; i++){//縦：y
      for(var k = 0; k < stageArr[i].length; k++){//横：x
        stageArr[i][k] = {
          object: ""
        };
      }
    }
  }
  /*==============================
  駒の初期化
  ==============================*/    
  initSetChess(group,stageArr){
    console.log("stageArr",stageArr)
    let count = 0;
    let pos = {
      x: 0,
      y: 0
    };
    let index;
    for(var i = 0; i < stageArr.length; i++){//縦：y
      for(var k = 0; k < stageArr[i].length; k++){//横：x
        if(stageArr[i][k] !== 0){
          index = stageArr[i][k] - 1;
          pos = this.stageProp.getPositionNumber(k,i);
          group.children.entries[index].x = pos.x;
          group.children.entries[index].y = pos.y;
          group.children.entries[index].areaArr = this.moveArea.setArrPosition(k,i,group.children.entries[index]);
          this.setProperty(k,i,"object",group.children.entries[index]);          
          count++;
        }
      }
    }
  }

  setProperty(x,y,prop,data){
    let stageArr = this.scene.stageData.tilePropertyArr[y][x];

    switch(prop){
      case 'object':
        stageArr.object = data;
        break;
      default:
    }
  }
  touchedTile(x,y){
    /*============
    タイルの取得
    ============*/
    let tile = this.scene.stageData.tilePropertyArr[y][x];

    if(this.scene.stageStatus === "SET_CHESS"){
      this.touchedPos = {
        x: x,
        y: y
      }
      if(this.scene.setChess.player1_Arr[y][x] === 1 && this.scene.setChess.selectedChess){
        this.scene.modalManager.layout.open();
        this.mode = "set";  
      }else{
        this.scene.modalManager.close();
        this.mode = "";  
      }
      return;
    }

    if(tile.object.type === "player1"){
      if(this.selectedChess){
        this.moveArea.hide(this.selectedChess);
      }
             
      this.selectedChess = tile.object;
      this.moveArea.show(this.selectedChess);
      this.beforeChessPos.x = x;
      this.beforeChessPos.y = y;
    }

    if(this.selectedChess){
      if(this.selectedChess.areaArr[y][x] === 1){
        this.scene.modalManager.move.open();
        this.mode = "move";
      }
      if(this.selectedChess.areaArr[y][x] === 2){
        if(tile.object.type === "player2"){
          this.enemyChess = tile.object;
          this.scene.modalManager.attack.open();
          this.mode = "attack";
        }else{
          this.scene.modalManager.close();
          this.mode = "";          
        }
      }
      if(this.selectedChess.areaArr[y][x] === 3){
        if(tile.object.type === "player2"){
          this.enemyChess = tile.object;
          this.scene.modalManager.attack.open();
          this.mode = "attack";
        }else{
          this.scene.modalManager.move.open();
          this.mode = "move";     
        }
      }
      if(this.selectedChess.areaArr[y][x] === 0){
        this.scene.modalManager.close();
        this.mode = "";     
      }
      this.touchedPos = {
        x: x,
        y: y
      }

    }
  }

  /*============
  検索
  ============*/
  searchAttackArea(){
    /*player2の駒を検索する */
    let player1ChessArr = this.player1ChessArr();
    let getNextStepArr = [];
    let choicedChessArr = [];
    let choicedChessObject;
    let choicedChessTarget;
    let choicedChessTargetObject;
    let check;

    /*chessの数だけ検索する*/
    this.scene.player2ChessGroup.children.entries.forEach(
      (chess,index) => {
        check = this.getCanAttackOnlyChess(chess,player1ChessArr);
        if(check){
          getNextStepArr.push(check);     
        }
      }
    ,this);

    //攻撃エリアになかったら、移動した先で攻撃できるか
    if(getNextStepArr.length === 0){
      this.scene.player2ChessGroup.children.entries.forEach(
        (chess,index) => {
          check = this.getCanMoveToAttackChess(chess,player1ChessArr);
          if(check){
            getNextStepArr.push(check);
          }
        }
      ,this);
    }

    
    if(getNextStepArr.length > 0){
      //評価値が一番高いchessを選ぶ
      choicedChessArr = this.searchEvaluationPoint(getNextStepArr);

      choicedChessObject = choicedChessArr[0].object;

      
      let choicedChessObjectBeforePos = this.stageProp.getPositionInt(choicedChessObject.x,choicedChessObject.y);

      this.beforeChessPos.x = choicedChessObjectBeforePos.X;
      this.beforeChessPos.y = choicedChessObjectBeforePos.Y;


      choicedChessTarget = choicedChessArr[0].target;
      choicedChessTargetObject = choicedChessArr[0].target.object;

      //移動->攻撃はmoveXに値があるかで判定する。
      if(choicedChessTarget.moveX !== 0 && choicedChessTarget.moveY !== 0){
        choicedChessObject.move(choicedChessTarget.moveX,choicedChessTarget.moveY,choicedChessObject);
      }else{
        choicedChessObject.attack(choicedChessTargetObject);
      }
    }else{
      //攻撃する相手がいなかったらランダムで移動する。
      //ランダムでchsssを選ぶ
      let moveGroup = this.scene.player2ChessGroup.children.entries;
      let moveGroupLength = moveGroup.length;
      let moveRandom = this.scene.getRandomInt(0,moveGroupLength-1);
      let moveChess = moveGroup[moveRandom];
      let moveChessBeforePos = this.stageProp.getPositionInt(moveChess.x,moveChess.y);
      this.beforeChessPos.x = moveChessBeforePos.X;
      this.beforeChessPos.y = moveChessBeforePos.Y;

      let moveNextArr = [];
      let moveNextSavePos = {
        X: 0,
        Y: 0
      };
      let moveNextPos;
      for(var i = 0; i < moveChess.areaArr.length; i++){
        for(var k = 0; k < moveChess.areaArr[i].length; k++){
          if(this.scene.stageData.tilePropertyArr[i][k].object === ""){
            if(moveChess.areaArr[i][k] === 1 || moveChess.areaArr[i][k] === 3){
              moveNextSavePos.X = k;
              moveNextSavePos.Y = i;
              moveNextArr.push(moveNextSavePos);
            }
          }
        }
      }
      moveNextPos = moveNextArr[this.scene.getRandomInt(0,moveNextArr.length-1)];
      moveChess.move(moveNextPos.X,moveNextPos.Y,moveChess)

    }
    
  }
  /*==============
  相手の駒を全て配列に入れておく。
  ==============*/
  player1ChessArr(){
    let arr = [];
    for(var i = 0; i < this.scene.stageData.tilePropertyArr.length; i++){
      for(var k = 0; k < this.scene.stageData.tilePropertyArr[i].length; k++){
        if(this.scene.stageData.tilePropertyArr[i][k].object.type === "player1"){
          arr.push({
            object: this.scene.stageData.tilePropertyArr[i][k].object,
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
  getCanAttackChess(chess,player1ChessArr,pos){

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
      moveArr = this.moveArea.setArrPosition(
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

        let evaluationPoint = this.calcEvaluationPoint(chess,player1ChessArr[i].object,count)
        
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

  getCanAttackOnlyChess(chess,player1ChessArr){
    let checkArr = [];
    let check = this.getCanAttackChess(chess,player1ChessArr);
    if(check){
      checkArr.push(check);
    }
    if(checkArr.length > 0){
      return checkArr;
    }else{
      return;
    }
  }

  getCanMoveToAttackChess(chess,player1ChessArr){
    let checkArr = [];
    let check;
    let pos = {
      X: 0,
      Y: 0
    };
    for(var i = 0; i < chess.areaArr.length; i++){
      for(var k = 0; k < chess.areaArr[i].length; k++){
        if(this.scene.stageData.tilePropertyArr[i][k].object === ""){
          if(chess.areaArr[i][k] === 1 || chess.areaArr[i][k] === 3){
            pos.X = k;
            pos.Y = i;
            check = this.getCanAttackChess(chess,player1ChessArr,pos);
            
            if(check){
              checkArr.push(check);
            } 
          }  
        }
      }
    }
    if(checkArr.length > 0){
      return checkArr;
    }else{
      return;
    }
  }
  calcEvaluationPoint(chess1,chess2,count){
    /*
    chess1: 自分の駒
    chess2: 相手の駒
    count: 何回目のロジックか
    ===
    |ポイント| 条件         |
    |40P    |１回目で倒せたら|
    |30P    |１回目で倒せない|
    |20P    |１回目で倒せたら|
    |10P    |１回目で倒せない|
    ※防御力＞攻撃力の場合、ランダムで0か1をダメージとして与えるので実際に倒せるかは厳密にしない。
    */
   let point = 0;
   let hp = chess1.status.hp;
  //  let saveHp = chess1.status.hp;

    //相手の駒を倒せるか
    let damage = chess1.status.power - chess2.status.defense;
    if(damage <= 0){
      damage = this.scene.getRandomInt(0,1);
    }
    hp -= damage;
    if(hp <= 0){
      point = 40;
    }else{
      point = 30;
    }
    if(count === 1){
      point -= 20;
    }
    return point;
  }
  searchEvaluationPoint(data){

    let checkPoint = data[0][0][0];
    let checkData = data[0][0];

    for(var i = 0; i < data.length;i++){
      for(var k = 0; k < data[i].length;k++){//chess毎
        if(checkPoint < data[i][k][0].evaluationPoint){
          checkPoint = data[i][k][0].evaluationPoint;
          checkData = data[i][k];
        }
      }
    }
    return checkData;
  }
  removeChess(chess){
    let posInt = this.stageProp.getPositionInt(chess.x,chess.y);
    this.scene.stageData.tilePropertyArr[posInt.Y][posInt.X].object = "";
    chess.destroy();
    this.player1Count = 0;
    this.player2Count = 0;

    for(var i = 0; i < this.scene.stageData.tilePropertyArr.length; i++){
      for(var k = 0; k < this.scene.stageData.tilePropertyArr[i].length; k++){
        if(this.scene.stageData.tilePropertyArr[i][k].object.type === "player1"){
          this.player1Count++;
        }
        if(this.scene.stageData.tilePropertyArr[i][k].object.type === "player2"){
          this.player2Count++;          
        }
      }
    }


    if(this.player1Count === 0){
      this.gameStatus = "gameover";
    }
    if(this.player2Count === 0){
      this.gameStatus = "gameclear";
    }

  }

}