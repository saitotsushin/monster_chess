import LoadGameData     from '../../data/LoadGameData';
import CreateStage      from './stage/CreateStage';

import CreateChessGroup from './stage/CreateChessGroup';
import MoveArea from './stage/MoveArea';

export default class StageManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;
    // this.create();
    this.LoadGameData = new LoadGameData();
    this.CreateStage;
    this.CreateChessGroup;
  }
  initScene(setting){
    
    this.CreateStage = new CreateStage({
      scene: this.scene,
      mapData: this.LoadGameData.mapData[setting.map]
    });
    this.MoveArea = new MoveArea({
      scene     : this.scene,
      x         : this.CreateStage.layer.x,
      y         : this.CreateStage.layer.y,
      tileWidth : this.CreateStage.tileWidth,
      tileHeight: this.CreateStage.tileHeight
    });
  }
  /*==============================
  チェスグループの生成
  ------------------------------*/
  createChessGroup(setting){
    /*チェスグループの生成*/
    this.CreateChessGroup = new CreateChessGroup({
      scene: this.scene,
      addGroup: setting.addGroup,//追加するグループ
      chessData: setting.chessData,//チェスデータ
      layoutData: setting.layoutData,//レイアウトデータ
      playerType: setting.playerType
    });    
  }
  /*==============================
  相手のチェスグループの生成
  ------------------------------*/
  createEnemyGroup(setting){
    let layoutData2 = setting.layoutData;
    let updateSetting = setting;
    for(var i = 0; i < layoutData2.length; i++){
      layoutData2[i].reverse();
    }
    layoutData2.reverse();
    updateSetting.layoutData = layoutData2;
    /*チェスグループの生成*/
    this.createChessGroup(updateSetting);
  }

  /*==============================
  移動エリアの表示
  ------------------------------*/
  showMoveArea(setting){
    this.MoveArea.hide();
    let chess = setting.chess;
    chess.areaMap = this.MoveArea.getAreaMap(setting);
    this.MoveArea.show(chess)
  }
  /*==============================
  移動エリアの非表示
  ------------------------------*/
  hideMoveArea(){
    this.MoveArea.hide();
  }
  /*==============================
  自分のターン完了
  ------------------------------*/   
  turnFin(){
    this.hideMoveArea();  
  }   
}