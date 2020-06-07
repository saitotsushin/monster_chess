
export default class CreateTouchTile {
  constructor(config) {
    this.scene = config.scene;
    this.mapData = config.mapData;
    this.mapTile = config.mapTile;
    this.layer = config.layer;
    this.create();
  }
  create(){
    let area;
    for(var i = 0; i < this.mapData.length; i++){
      for(var k = 0; k < this.mapData[i].length; k++){
        area = this.scene.add.sprite(0,0,'spritesheet',"chess_shadow");
        area.depth = 2;
        area.x = k * this.mapTile.tileWidth + this.mapTile.tileWidth/2 + this.layer.x;
        area.y = i * this.mapTile.tileHeight + this.mapTile.tileHeight/2 + this.layer.y;
        area.pos = {
          X: k,
          Y: i
        }
        // area.groundType = this.mapData[i][k];
        area.setInteractive();
        let _this = this;
        area.on('pointerdown', function (pointer) {
          _this.scene.touchStage(this.pos);
          // return this.pos;
        }); 
      }
    }

  }
}