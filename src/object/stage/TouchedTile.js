export default class TouchedTile {
  constructor(config) {
    this.scene = config.scene;
    this.marker = config.scene.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(
      0,
      0,
      config.scene.map.tileWidth,
      config.scene.map.tileHeight
    );
  }
  getTilePosition(){

    var worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);

    var pointerTileX = this.scene.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.scene.map.worldToTileY(worldPoint.y);

    this.marker.x = this.scene.map.tileToWorldX(pointerTileX);
    this.marker.y = this.scene.map.tileToWorldY(pointerTileY);
    var tile = this.scene.map.getTileAt(pointerTileX, pointerTileY);

    let postion = {
      number: {
        X: 0,
        Y: 0
      },
      local: {
        x: 0,
        y: 0  
      },
      world:{
        x: 0,
        y: 0  
      }
    }

    let layer = this.scene.StageManager.StageLayer.layer;
 
    if (tile){
      postion.number.X = pointerTileX;
      postion.number.Y = pointerTileY;
      postion.local.x  = tile.y * this.scene.map.tileWidth + layer.x;
      postion.local.y  = tile.y * this.scene.map.tileHeight + layer.y;
      postion.world.x  = tile.y * this.scene.map.tileWidth;
      postion.world.y  = tile.y * this.scene.map.tileHeight;
      return postion;
    }
  }
}