
import ChessData     from '../../../data/ChessData';
import Chess         from '../../chess/Chess';

export default class CreateChessGroup {
  constructor(config) {
    this.scene = config.scene;
    this.addGroup = config.addGroup;
    this.chessData = config.chessData;
    this.layoutData = config.layoutData;
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
          // sprite.setInteractive();
          sprite.status = item.status;
          sprite.cost = item.cost;
          sprite.no = item.no;
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
    let baseLeft = 20;
    let baseHeight = 20;    
    let addGroup = this.addGroup.children.entries;

    for(var i = 0; i < this.layoutData.length; i++){
      for(var k = 0; k < this.layoutData[i].length; k++){
        if(this.layoutData[i][k] !== 0){
          let count = Number(this.layoutData[i][k]);
          let chess = addGroup[count-1];
          chess.x = k * 20 + baseLeft;
          chess.y = i * 20 + baseHeight;
          chess.tilePos = {
            X: k,
            Y: i
          };
          chess.groupIndex = count;
        }
      }
    }    
  }
}