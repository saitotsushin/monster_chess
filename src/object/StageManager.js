import StageData      from './StageData';
import StageLayer     from './stage/StageLayer';
import MoveArea       from './stage/MoveArea';
import TouchedTile    from './stage/TouchedTile';
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
    this.tilePropertyArr = this.StageData.tilePropertyArr;



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
    Init.initStage(this.tilePropertyArr);

  }
  touchedStage(pos){

    let X = pos.number.X;
    let Y = pos.number.Y;
    let tile = this.tilePropertyArr[Y][X];
    let tileProp = TileCheck.tileCheck(this.scene,tile,pos);
    let modal = this.scene.ModalManager;
    if(tileProp){
      if(tileProp.MODE){
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
    }
    if(this.STATUS.STAGE === "MOVE"){

      nextPos = this.getTilePositionNumber(this.nextChessPos.X,this.nextChessPos.Y);

      this.scene.PlayerManager.selectedChess.move(nextPos.world.x,nextPos.world.y);
      this.MoveArea.hide(this.scene.PlayerManager.selectedChess);
      Prop.setPropChess(this.scene);//ステージのプロパティの更新
      this.STATUS.STAGE = "FIN";
      modal.open();

    }
    if(this.STATUS.STAGE === "SELECTED_TRAP"){
      Prop.setPropTrap(this.scene,this.scene.PlayerManager.selectedTrap);
      this.STATUS.STAGE = "FIN"
    }
    if(this.STATUS.STAGE === "FIN"){
    }
  }
  getTilePositionNumber(X,Y){
    let position = {
      // number: {
      //   X: 0,
      //   Y: 0
      // },
      local: {
        x: 0,
        y: 0  
      },
      world:{
        x: 0,
        y: 0  
      }
    }
    // position.number.X = (position.world.x - this.layer.x) /this.scene.map.tileWidth;
    // position.number.Y = (position.world.y - this.layer.y) /this.scene.map.tileHeight;
    position.world.x = X * this.scene.map.tileWidth + this.StageLayer.layer.x + this.scene.map.tileWidth/2;
    position.world.y = Y * this.scene.map.tileHeight + this.StageLayer.layer.y + this.scene.map.tileHeight/2;
    position.local.x = X * this.scene.map.tileWidth;
    position.local.y = Y * this.scene.map.tileHeight;   
    
    return position;
  }

}