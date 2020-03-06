import StageData      from './StageData';
import StageLayer     from './stage/StageLayer';
import MoveArea       from './stage/MoveArea';
import TouchedTile    from './stage/TouchedTile';

import * as Search    from './stage/FunctionStageSearch';
import * as Layout    from './stage/FunctionStageLayout';
import * as Init      from './stage/FunctionStageInit';
import * as Prop      from './stage/FunctionStageProp';
import * as TileCheck from './stage/FunctionStageTileCheck';

export default class StageManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;

    this.STATUS = {
      STAGE: "INIT",
      CHESS: "",
      TURN: "player1"
    }

    /*ステージの読み込みと設定*/
    this.StageLayer = new StageLayer({
      scene: this.scene
    });

    /*ステージプロパティデータの読み込み*/
    this.StageData = new StageData({
      scene: this.scene
    });
    this.tilePropMap = this.StageData.tilePropMap;



    /*タッチUIの生成*/
    this.TouchedTile = new TouchedTile({
      scene: this.scene
    });

    /*移動エリアの生成*/
    this.MoveArea = new MoveArea({
      scene: this.scene,
      StageManager: this
    });

    this.enemyChess = "";

    this.beforeChessPos = {
      X: 0,
      Y: 0
    }
    this.nextChessPos = {
      X: 0,
      Y: 0
    }
    /*ステージの初期化*/
    Init.initStage(this.tilePropMap);

  }
  touchedStage(pos){

    let X = pos.number.X;
    let Y = pos.number.Y;
    let tile = this.tilePropMap[Y][X];
    let tileProp = TileCheck.tileCheck(this.scene,tile,pos);
    let modal = this.scene.ModalManager;
    if(tileProp){
      console.log("tileProp",tileProp)
      if(tileProp.MODE && this.STATUS.STAGE !== 'FIN'){
        this.STATUS.STAGE = tileProp.MODE;
      }
      this.nextChessPos.X = tileProp.nextPos.X;
      this.nextChessPos.Y = tileProp.nextPos.Y;
    }

    if(this.STATUS.STAGE !== ""){
      modal.open();
    }
    
  }
  modalYes(){
    let nextPos = {
      X: 0,
      Y: 0
    };
    let modal = this.scene.ModalManager;

    if(this.STATUS.STAGE === "LAYOUT_AUTO"){
      Layout.layoutAuto(this.scene,"player1","auto");
      Layout.layoutAuto(this.scene,"player2","auto");
      Prop.setProp(this.scene);
      this.STATUS.STAGE = ""
      return;
    }

    if(this.STATUS.STAGE === "MOVE"){

      nextPos = Prop.getTilePositionNumber(this.nextChessPos.X,this.nextChessPos.Y,this.scene);
      this.scene.PlayerManager.selectedChess.move(
        nextPos.world,
        this.nextChessPos
      );

      this.MoveArea.hide(this.scene.PlayerManager.selectedChess);

      //ステージのプロパティと駒の移動エリアの更新
      Prop.updateStageProps(this.scene);

      this.STATUS.STAGE = "FIN";
      modal.open();
      return;

    }
    if(this.STATUS.STAGE === "SELECTED_TRAP"){
      Prop.setPropTrap(this.scene,this.scene.PlayerManager.selectedTrap);
      this.STATUS.STAGE = "FIN"
      console.log("this.tilePropMap",this.tilePropMap)
      return;
    }
    if(this.STATUS.STAGE === "FIN"){
      let selectedChess = Search.thinkAI(this.scene);
      console.log("selectedChess",selectedChess);
      this.actChess(selectedChess);
    }
  }
  actChess(selectedChess){
    // let chess = selectedChess.chess;
    // let target = selectedChess.target;
    // let int = selectedChess.int;
    // let mode = selectedChess.mode;
    // console.log("this.scene",this.scene)
    // let pos = Prop.getTilePositionNumber(int,this.scene)
    // if(mode === "ATTACK"){
    //   chess.attack(target);
    // }
    // if(mode === "MOVE"){
    //   chess.move(pos,int);
    // }

  }


}