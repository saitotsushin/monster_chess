import Player1 from './player/Player1';
import PlayerData from './PlayerData';

export default class PlayerManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;

    this.Player1 = new Player1({
      scene: this.scene
    });

    /*選択中の駒の保存*/
    this.selectedChess;

    /*選択中の相手駒の保存*/
    this.targetChess;
    
    /*選択中のトラップの保存*/
    this.selectedTrap;

    /*プレイヤーデータの読み込み*/
    this.PlayerData = new PlayerData({
      scene: this.scene
    });

    this.player1_ChessList = this.PlayerData.player1_ChessList;
    this.player2_ChessList = this.PlayerData.player2_ChessList;

    this.player1_Arr = this.PlayerData.player1_Arr;
    this.player1Auto_Arr = this.PlayerData.player1Auto_Arr;

    this.player2_Arr = this.PlayerData.player2_Arr;
    this.player2Auto_Arr = this.PlayerData.player2Auto_Arr;

    this.player1ChessGroup = this.scene.add.group();
    this.player2ChessGroup = this.scene.add.group();

    this.setPlayerGroup("player1");
    this.setPlayerGroup("player2");

  }
  setPlayerGroup(mode){
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
          sprite.status = item.status;
          sprite.areaMapBase = sprite.mergeArea(sprite.moveAreaMapBase,sprite.attackAreaMapBase,sprite.areaMapBase);
          group.add(sprite);
        }
      },this);

    }

  }

}