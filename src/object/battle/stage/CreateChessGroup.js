
import ChessData     from '../../../data/ChessData';
import Chess         from '../../chess/Chess';

export default class CreateChessGroup {
  constructor(config) {
    this.scene = config.scene;
    this.addGroup = config.addGroup;
    this.chessData = config.chessData;
    this.chessMapData = config.chessMapData;
    this.playerType = config.playerType;
    this.create();
  }
  create(){
    /*==============================
    チェスグループの生成
    ------------------------------*/  
    this.ChessData = new ChessData();

    let playerChessList = this.chessData;
    
    let chessDataList = this.ChessData.chessList;

    let playerType = this.playerType;
    
    for(var i = 0; i < playerChessList.length;i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          let sprite = new Chess({
            scene: this.scene,
            x: i * 20 + 20,
            y: 80,
            frame: item.key,
            key: 'spritesheet'
          });
          sprite.depth = 20;
          sprite.status = item.status;
          sprite.playerType = playerType;
          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;
          sprite.areaMapBase = sprite.mergeArea(
            sprite.moveAreaMapBase,
            sprite.attackAreaMapBase,
            sprite.areaMapBase
          );
          this.addGroup.add(sprite)
        }
      },this);
    }
    /*チェスグループの生成後にレイアウト*/
    this.layoutChess();

  }
  /*==============================
  チェスグループのレイアウト
  ------------------------------*/  
  layoutChess(){
    let baseLeft = 0;
    let baseHeight = 20; 
    let chessWidth = 32;   
    let addGroup = this.addGroup.children.entries;

    for(var i = 0; i < this.chessMapData.length; i++){
      for(var k = 0; k < this.chessMapData[i].length; k++){
        if(this.chessMapData[i][k] !== 0){
          let count = Number(this.chessMapData[i][k]);
          let chess = addGroup[count-1];
          let position = {
            x: k * chessWidth + chessWidth/2 + baseLeft,
            y: i * chessWidth + chessWidth/2 + baseHeight
          };
          let int = {
            X: k,
            Y: i
          }
          chess.move(position,int);

          let settingStatus = {
            power: chess.status.power,
            hp: chess.status.maxHp
          };
          chess.setStatus(settingStatus)
          // chess.x = k * chessWidth + chessWidth/2 + baseLeft;
          // chess.y = i * chessWidth + chessWidth/2 + baseHeight;
          // chess.tilePos = {
          //   X: k,
          //   Y: i
          // };
          chess.groupIndex = count;
        }
      }
    }    
  }
}