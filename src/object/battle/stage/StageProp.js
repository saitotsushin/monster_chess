export default class StageProp {
  constructor(config) {
    this.scene = config.scene;
  }
  /*==============================
  ステージ上のx,yを返す
  ==============================*/    
  getPositionNumber(X,Y){
    let pos = {
      x: 0,
      y: 0
    };
    let layerX = this.scene.stageManager.layer.x;
    let layerY = this.scene.stageManager.layer.y;
    let mapWidth = this.scene.stageManager.map.tileWidth;
    let mapHeight = this.scene.stageManager.map.tileHeight;

    pos.x = layerX + mapWidth * X + mapWidth/2;
    pos.y = layerY + mapHeight * Y + mapHeight/2;

    return pos;

  }
  /*==============================
  位置(x,y)からステージのX,Yを返す
  ==============================*/    
  getPositionInt(x,y){
    let pos = {
      X: 0,
      Y: 0
    };
    let layerX = this.scene.stageManager.layer.x;
    let layerY = this.scene.stageManager.layer.y;
    let mapWidth = this.scene.stageManager.map.tileWidth;
    let mapHeight = this.scene.stageManager.map.tileHeight;

    pos.X = (x - layerX - mapWidth/2) / mapWidth;
    pos.Y = (y - layerY - mapHeight/2) / mapHeight;

    return pos;

  }
}