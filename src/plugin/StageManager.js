

export default class StageManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;
    this.layer = gameScene.scene.stageLayer;
    this.map = gameScene.scene.map;
    this.selectedChess = "";
  }
  initStage(stageArr){
    for(var i = 0; i < stageArr.length; i++){//縦：y
      for(var k = 0; k < stageArr[i].length; k++){//横：x
        stageArr[i][k] = {
          object: ""
        };
      }
    }
  }
  initSetChess(group,stageArr){
    let count = 0;
    let pos = {
      x: 0,
      y: 0
    };
    for(var i = 0; i < stageArr.length; i++){//縦：y
      for(var k = 0; k < stageArr[i].length; k++){//横：x
        if(stageArr[i][k] !== 0){
          pos = this.getPositionNumber(k,i);
          group.children.entries[count].x = pos.x;
          group.children.entries[count].y = pos.y;
          group.children.entries[count].MoveArea.setPostion(k,i);

          this.setProperty(k,i,"object",group.children.entries[count])
          
          count++;
        }
      }
    }
  }
  getPositionNumber(x,y){
    let pos = {
      x: 0,
      y: 0
    };

    pos.x = this.layer.x + this.map.tileWidth * x + this.map.tileWidth/2;
    pos.y = this.layer.y + this.map.tileHeight * y + this.map.tileHeight/2;

    return pos;

  }
  setProperty(x,y,prop,data){
    let stageArr = this.scene.stageData.tilePropertyArr[y][x];

    switch(prop){
      case 'object':
        stageArr.object = data;
        break;
      default:
        console.log('no prop');
    }
  }
  touchedTile(x,y){
    let tile = this.scene.stageData.tilePropertyArr[y][x];
    if(tile.object.type === "player1"){
      if(this.selectedChess){
        this.selectedChess.MoveArea.hideAll();
      }
      tile.object.MoveArea.showAll();        
      this.selectedChess = tile.object;
    }
    
    if(this.selectedChess){
      if(this.selectedChess.moveAreaArr[y][x] === 1){
        console.log("移動しますか？");
      }
      if(this.selectedChess.attackAreaArr[y][x] === 1 && tile.object.type === "player2"){
        console.log("攻撃しますか？");
      }

    }
  }
}