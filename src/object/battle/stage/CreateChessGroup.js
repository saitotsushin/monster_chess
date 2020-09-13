
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
    // let countup = 1;

    let playerType = this.playerType;
    let sprite;
    for(var i = 0; i < playerChessList.length;i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          sprite = new Chess({
            scene: this.scene,
            x: i * 20 + 20,
            y: 80,
            frame: item.key,
            key: 'spritesheet'
          });
          sprite.depth = 20;
          // sprite.status = item.status;
          let status_hp = item.status.hp;
          let status_maxHp = item.status.maxHp;
          let status_power = item.status.power;
          let status_difence = item.status.difence;
          // let status = item.status;
          // sprite.status = status;
          sprite.status.hp = status_hp;
          sprite.status.maxHp = status_maxHp;
          sprite.status.power = status_power;
          sprite.status.difence = item.status.difence;
          // sprite.hp = item.status.hp;
          let moveAreaMapBase = [...item.moveAreaMapBase];;
          let attackAreaMapBase = [...item.attackAreaMapBase];
          sprite.playerType = playerType;
          sprite.moveAreaMapBase = moveAreaMapBase;
          sprite.attackAreaMapBase = attackAreaMapBase;
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
    console.log("this.chessMapData",this.chessMapData)
    let count = 0;

    if(this.playerType === 'player1'){

      for(var i = 0; i < this.chessMapData.length; i++){
        for(var k = 0; k < this.chessMapData[i].length; k++){
          if(this.chessMapData[i][k] !== 0){
            this.setLayoutChess(i,k,count);
            count++;
          }
        }
      }    
    }else{
      for(var i = this.chessMapData.length-1; i >= 0; i--){
        for(var k = 0; k < this.chessMapData[i].length; k++){
          if(this.chessMapData[i][k] !== 0){
            this.setLayoutChess(i,k,count);
            count++;
          }
        }
      }    
    }
  }
  setLayoutChess(i,k,count){
    let baseLeft = 0;
    let baseHeight = 20; 
    let chessWidth = 32;   
    let addGroup = this.addGroup.children.entries;

    let chess = addGroup[count];
    let position = {
      x: k * chessWidth + chessWidth/2 + baseLeft,
      y: i * chessWidth + chessWidth/2 + baseHeight
    };
    let int = {
      X: k,
      Y: i
    }
    chess.move(position,int);
    chess.icon_levelup.setVisible(false);

    let settingStatus = {
      power: chess.status.power,
      hp: chess.status.maxHp
    };
    chess.setStatus(settingStatus)
    chess.groupIndex = count + 1;
  }
}