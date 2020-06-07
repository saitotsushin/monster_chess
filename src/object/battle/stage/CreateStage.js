
export default class CreateStage {
  constructor(config) {
    this.scene = config.scene;

    this.mapData = config.mapData;
    this.mapTile;
    this.layer;
    /*タイルの大きさを指定*/
    this.tileWidth = 32;
    this.tileHeight = 32;    

    this.create();
  }
  create(){
    this.mapTile = this.scene.make.tilemap(
      {
        data: this.mapData,
        tileWidth: this.tileWidth,
        tileHeight: this.tileHeight
      }
    );
    let tiles = this.mapTile.addTilesetImage('tiles');
    this.layer = this.mapTile.createStaticLayer(0, tiles, 0, 0);
    this.layer.x = (this.scene.game.config.width - this.layer.width) /2;
    this.layer.y = 20;
    this.layer.depth = 1;

    let area;

  }
}