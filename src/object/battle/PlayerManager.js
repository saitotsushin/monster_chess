import Player1 from './player/Player1';
import PlayerData from './PlayerData';

export default class PlayerManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;
  }
  create(){

    this.Player1 = new Player1({
      scene: this.scene
    });

    /*選択中の駒の保存*/
    this.selectedChess;

    /*選択中の相手駒の保存*/
    this.targetChess;

    /*移動した駒の保存*/
    this.movedChess;
    
    /*選択中のトラップの保存*/
    this.selecteditem;
    

    /*プレイヤーデータの読み込み*/
    this.PlayerData = new PlayerData({
      scene: this.scene
    });

    this.player1_ChessList;

    this.PLAYER_NUMBER = "";//player1 or player2


    if(this.scene.registry.list.player1_ChessList){
      this.player1_ChessList = this.scene.registry.list.player1_ChessList;
    }else{
      this.player1_ChessList = this.PlayerData.player1_ChessList;
    }

    this.player2_ChessList = this.PlayerData.player2_ChessList;

    this.player1_Arr;

    this.player1_Map;

    if(this.scene.registry.list.player1Auto_Arr){
      this.player1Auto_Arr = this.scene.registry.list.player1Auto_Arr;
    }else{
      this.player1Auto_Arr = this.PlayerData.player1Auto_Arr;
      this.player1_Map = this.PlayerData.player1_Map;
    }
    this.player1_Arr = this.player1Auto_Arr;

    this.player2_Arr = this.PlayerData.player2_Arr;
    this.player2Auto_Arr = this.PlayerData.player2Auto_Arr;

    this.player1ChessGroup = this.scene.add.group();
    this.player2ChessGroup = this.scene.add.group();


  }
  createPlayerGroup(mode){
    let chessDataList = this.scene.ChessManager.ChessData.chessList;
    let playerChessList;
    let group;
    let sprite;
    if(mode === "player1"){
      playerChessList = this.player1_ChessList;
      group = this.player1ChessGroup;
    }
    
    if(mode === "player2"){
      playerChessList = this.player2_ChessList;
      group = this.player2ChessGroup;
    }

    for(var i = 0; i < playerChessList.length; i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          sprite = this.scene.ChessManager.createChess(
            item.className,
            item.key,
            mode
          );
          sprite.attribute = item.attribute;
          sprite.groupIndex = i + 1;
          sprite.x = -40;//画面外にしておく
          sprite.status = item.status;
          sprite.cost = item.cost;
          sprite.no = item.no;
          sprite.status = item.status;
          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;
          sprite.areaMapBase = sprite.mergeArea(
            sprite.moveAreaMapBase,
            sprite.attackAreaMapBase,
            sprite.areaMapBase
          );
          group.add(sprite);
        }
      },this);

    }

  }
}