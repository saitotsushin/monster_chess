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
    this.CreateChessGroup2;
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
    //レジストリにマップデータを保存
    this.scene.registry.list.mapData = this.LoadGameData.mapData[setting.map];//レジストリに保存

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
      chessMapData: setting.chessMapData,//レイアウトデータ
      playerType: setting.playerType
    });    
  }
  /*==============================
  相手のチェスグループの生成
  ------------------------------*/
  createEnemyGroup(setting){
    let chessMapData2 = setting.chessMapData;
    let updateSetting = setting;
    updateSetting.chessMapData = chessMapData2;
    /*チェスグループの生成*/
    this.CreateChessGroup2 = new CreateChessGroup({
      scene: this.scene,
      addGroup: updateSetting.addGroup,//追加するグループ
      chessData: updateSetting.chessData,//チェスデータ
      chessMapData: updateSetting.chessMapData,//レイアウトデータ
      playerType: updateSetting.playerType
    });
  }
  setKingToChessCPU(group,chessMapData){
    let get_index = 0;
    let back_index = 0;
    /*一番奥の駒を取得する*/
    for(var i = chessMapData.length - 1; i >= 0; i--){
      for(var k = 0; k < chessMapData[i].length; k++){
        /*逆順（右端から）で検索*/
        back_index = chessMapData[i].length - k - 1;
        if(chessMapData[i][k] !== 0){
          get_index = chessMapData[i][k];
          // break;
        }
      }
    }
    group.children.entries.forEach(
      (sprite,index) => {
        if(index + 1 === get_index){
          // sprite.icon_king.setVisible(true);
          sprite.isKing = true;
          sprite.icon_king.setVisible(true);
        }
      }
    );
  }  
  /*==============================
  相手のチェスグループの配置
  ------------------------------*/
  // layoutEnemyGroup(setting){
    // let chessMapData2 = setting.chessMapData;
    // let group = setting.group;
  // }
  /*==============================
  移動エリアの表示
  ------------------------------*/
  showMoveArea(setting){
    this.MoveArea.hide();
    let chess = setting.chess;
    let areaMaps = this.MoveArea.getAreaMap(setting);
    chess.areaMap = areaMaps.all;
    this.MoveArea.show(chess)
  }
  /*==============================
  チェスの表示
  ------------------------------*/
  showChessGroup(group,playerType){
    let _this = this;

    group.children.entries.forEach(
      (sprite,index) => {
        sprite.setVisible(true);
        sprite.AT_text.setVisible(true);
        sprite.HP_text.setVisible(true);
        sprite.chessStatus.setVisible(true);
        sprite.setVisible(true);
        //地形の力
        let myAttribute = Number(sprite.attribute);
        let groundType = _this.scene.registry.list.mapData[sprite.tilePos.Y][sprite.tilePos.X];
        if(myAttribute === groundType){
          sprite.icon_levelup.setVisible(true);
        }else{
          sprite.icon_levelup.setVisible(false);
        }     
        if(playerType === "player2"){
          sprite.icon_enemy.setVisible(true);
        }   
      }
    );
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