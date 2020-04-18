import * as Search     from './FunctionStageSearch';
import * as Prop       from './FunctionStageProp';

export default class NPC{
  constructor(config) {
    this.scene = config.scene;
    this.create();
  }
  create(){

  }
  myTurn(){
    let selectedChess = Search.thinkAI(this.scene);
    this.scene.TrapManager.setTrapByRandom();//トラップを置くか（移動前）
    this.actChess(selectedChess);
    this.scene.TrapManager.setTrapByRandom();//トラップを置くか（移動後）
    this.scene.StageManager.STATUS.TURN = 'player1';
    this.scene.StageManager.STATUS.STAGE = "";
    this.scene.PlayerManager.movedChess = "";
    Prop.updateAreaMap(this.scene);

  }
  /*==================
  敵のチェスの行動
  ==================*/
  actChess(selectedChess){
    let chess = selectedChess.chess;
    
    let pos = selectedChess.pos;
    let mode = selectedChess.mode;
    this.scene.StageManager.Cursor.x = selectedChess.x;
    this.scene.StageManager.Cursor.y = selectedChess.y;
    this.scene.StageManager.Cursor.setVisible(true);

    if(mode === "ATTACK"){
      let target = selectedChess.attackTarget;
      chess.attack(target);
    }
    if(mode === "MOVE"){
      this.scene.StageManager.beforeChessPos = {
        X: chess.pos.X,
        Y: chess.pos.Y
      }
      this.scene.StageManager.nextChessPos = {
        X: pos.X,
        Y: pos.Y
      } 
      this.scene.StageManager.moveChess(
        chess,
        pos
      );
      //リセット
      this.scene.StageManager.beforeChessPos = {
        X: 0,
        Y: 0,
      }
      this.scene.StageManager.nextChessPos = {
        X: 0,
        Y: 0
      }
    }
    

  }
}