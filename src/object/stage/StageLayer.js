export default class StageLayer {
  constructor(config) {
    /*ステージプロパティデータの読み込み*/
    this.map1 = config.mapData;
    config.scene.map = config.scene.make.tilemap(
      { data: this.map1, tileWidth: 30, tileHeight: 30 }
    );
    var tiles = config.scene.map.addTilesetImage('tiles');
    this.layer = config.scene.map.createStaticLayer(0, tiles, 0, 0);

    // config.scene.map = config.scene.make.tilemap({ key: 'map' });
    // config.scene.tileset = config.scene.map.addTilesetImage('tileset', 'tiles');
    // this.layer = config.scene.map.createDynamicLayer('stage', config.scene.tiles, 0, 0);
    // this.layer.setCollisionBetween(0, 100);
    // this.layer.setCollisionByProperty({ collides: true });
    // config.scene.physics.world.bounds.width = config.scene.map.widthInPixels;
    // config.scene.physics.world.bounds.height = config.scene.map.heightInPixels;
    this.layer.x = (config.scene.game.config.width - this.layer.width) /2;
    // this.layer.y = (config.scene.game.config.height - this.layer.height) /2;
    this.layer.y = 10;

    this.layer.setInteractive();
    this.layer.on('pointerdown', function (pointer) {

      let tilePos = config.scene.StageManager.TouchedTile.getTilePosition();
      config.scene.StageManager.touchedStage(tilePos);

    },this);

  }
}