import * as Func from '../common/Func';
import * as StageFunc from './StageFunc';
import * as StageInit from './StageInit';
import * as CalcEvaluation from './CalcEvaluation';
import MoveArea from './MoveArea';
import StageProp from '../utils/StageProp';


export default class StageManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;
    this.layer = gameScene.scene.stageLayer;
    this.map = gameScene.scene.map;
    this.selectedChess = "";
    this.enemyChess = "";
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

  initStage(arr){
    StageInit.initStage(arr);
  }

  /*============
  検索
  ============*/
  searchAttackArea(){
    /*player2の駒を検索する */
    let player1ChessArr = StageFunc.player1ChessArr(this.scene.stageData);
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
      choicedChessArr = CalcEvaluation.search(getNextStepArr);

      choicedChessObject = choicedChessArr[0].object;

      
      let choicedChessObjectBeforePos = this.stageProp.getPositionInt(choicedChessObject.x,choicedChessObject.y);

      this.beforeChessPos.x = choicedChessObjectBeforePos.X;
      this.beforeChessPos.y = choicedChessObjectBeforePos.Y;


      choicedChessTarget = choicedChessArr[0].target;
      choicedChessTargetObject = choicedChessArr[0].target.object;

      //移動->攻撃はmoveXに値があるかで判定する。
      if(choicedChessTarget.moveX !== 0 && choicedChessTarget.moveY !== 0){

        //移動
        choicedChessObject.move(choicedChessTarget.moveX,choicedChessTarget.moveY,choicedChessObject);

        //移動後にトラップがあるがチェックする
        StageFunc.checkTrap(
          choicedChessObject,
          this.scene.stageData.tilePropertyArr,
          this.stageProp.getPositionInt(choicedChessObject.x,choicedChessObject.y),
          this.scene
        );
        
        //ステージデータの更新
        StageFunc.updateTileProp(
          {
            afterPos: {
              x: choicedChessTarget.moveX,
              y: choicedChessTarget.moveY,
            },
            beforePos: {
              x: this.beforeChessPos.x,
              y: this.beforeChessPos.y,
            },
            stageData: this.scene.stageData,
            moveArea: this.moveArea,
            chess: choicedChessObject
          }
        );
      }else{
        //攻撃
        choicedChessObject.attack(choicedChessTargetObject);
      }
    }

    //攻撃する相手がいなかったらランダムで移動する。
    if(getNextStepArr.length === 0){
      
      //ランダムでchessを選ぶ
      let moveGroup = this.scene.player2ChessGroup.children.entries;
      let moveGroupLength = moveGroup.length;
      let moveRandom = Func.getRandomInt(0,moveGroupLength-1);
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

      moveNextPos = moveNextArr[Func.getRandomInt(0,moveNextArr.length-1)];
      moveChess.move(moveNextPos.X,moveNextPos.Y,moveChess);
      StageFunc.checkTrap(
        moveChess,
        this.scene.stageData.tilePropertyArr,
        this.stageProp.getPositionInt(moveChess.x,moveChess.y),
        this.scene
      );

      StageFunc.updateTileProp(
        {
          afterPos: {
            x: moveNextPos.X,
            y: moveNextPos.Y,
          },
          beforePos: {
            x: this.beforeChessPos.x,
            y: this.beforeChessPos.y,
          },
          stageData: this.scene.stageData,
          moveArea: this.moveArea,
          chess: moveChess
        }
      );
    }
    
  }

  getCanAttackOnlyChess(chess,player1ChessArr){
    let checkArr = [];
    let pos = "";
    let check = StageFunc.getCanAttackChess(chess,player1ChessArr,pos,this.moveArea);
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
            check = StageFunc.getCanAttackChess(chess,player1ChessArr,pos,this.moveArea);
            
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
  modalYes(){
    if(this.scene.STAGE_STATUS === "LAYOUT_FIN"){
      console.log("this.scene.stageData.player1Auto_Arr",this.scene.stageData.player1Auto_Arr)
      StageInit.initSetChess(
        this.scene.player1ChessGroup,
        this.scene.stageData.player1Auto_Arr,
        this.moveArea,
        this.stageProp,
        this.scene    
      );
      StageInit.initSetChess(
        this.scene.player2ChessGroup,
        this.scene.stageData.player2_Arr,
        this.moveArea,
        this.stageProp,
        this.scene    
      );
    }
    if(this.scene.STAGE_STATUS === "SELECTED_TRAP"){
      this.scene.trap.setTrap();
      this.scene.STAGE_STATUS = "";
      return;
    }
    if(this.scene.STAGE_STATUS === "" && this.scene.CHESS_STATUS === "FIN"){
      this.scene.STAGE_STATUS = "NEXT_TURN";
      this.scene.modalManager.nextTurn.open();
      return;
    }
    if(this.scene.STAGE_STATUS === "NEXT_TURN"){
      this.scene.STAGE_STATUS = "";
      this.scene.CHESS_STATUS = "";
      this.searchAttackArea();
    }
  }

}