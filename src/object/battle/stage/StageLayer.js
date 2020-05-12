export default class StageLayer {
  constructor(config) {
    /*ステージプロパティデータの読み込み*/
    this.map1 = config.mapData;
    config.scene.map = config.scene.make.tilemap(
      { data: this.map1, tileWidth: 20, tileHeight: 20 }
    );
    var tiles = config.scene.map.addTilesetImage('tiles');
    this.layer = config.scene.map.createStaticLayer(0, tiles, 0, 0);
    this.layer.x = (config.scene.game.config.width - this.layer.width) /2;
    this.layer.y = 10;

    this.layer.setInteractive();
    this.layer.on('pointerdown', function (pointer) {

      let tilePos = config.scene.StageManager.TouchedTile.getTilePosition();
      config.scene.StageManager.touchedStage(tilePos);

    },this);

  }
}