export default class StageLoad {
  constructor(config) {
    // this.scene = config.scene;
    config.scene.map = config.scene.make.tilemap({ key: 'map' });
    config.scene.tileset = config.scene.map.addTilesetImage('tileset', 'tiles');
    this.layer = config.scene.map.createDynamicLayer('stage', config.scene.tileset, 0, 0);
    this.layer.setCollisionBetween(0, 100);
    this.layer.setCollisionByProperty({ collides: true });
    config.scene.physics.world.bounds.width = config.scene.map.widthInPixels;
    config.scene.physics.world.bounds.height = config.scene.map.heightInPixels;
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