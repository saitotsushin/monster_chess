class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    });
  }
  preload() {
    this.make.text({
      x: this.sys.game.config.width/2,
      y: 100,
      text: 'LOADING...',
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontSize: 10,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center'
      }
    });
    let progressNumb = this.make.text({
      x: this.sys.game.config.width/2,
      y: 120,
      text: '',
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontSize: 10,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center'
      }
    });
    this.progress = this.add.graphics();

    this.load.on('progress', (value) => {
      this.progress.clear();
      this.progress.fillStyle(0xffffff, 1);
      progressNumb.text = Math.round(value*100) + "%";
    });

    this.load.on('complete', () => {
      this.progress.destroy();
      this.scene.start('GameScene');
    });


    //start loading
    this.load.pack('Preload', 'assets/pack.json', 'Preload');

    // this.load.image('tiles', 'assets/tilemaps/tile.png');
    // this.load.tilemapTiledJSON('map', 'assets/tilemaps/tilemap.json');

    // this.load.spritesheet('explosion_m', 'assets/images/explosion_m.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('chess', 'assets/images/chess.png');
    this.load.image('chess_1', 'assets/images/chess_1.png');
    this.load.image('chess_2', 'assets/images/chess_2.png');
    this.load.image('chess_3', 'assets/images/chess_3.png');
    this.load.image('chess_4', 'assets/images/chess_4.png');
    this.load.image('chess_5', 'assets/images/chess_5.png');
    this.load.image('set_area', 'assets/images/set_area.png');
    this.load.image('move_area', 'assets/images/move_area.png');
    this.load.image('attack_move_area', 'assets/images/attack_move_area.png');
    this.load.image('attack_area', 'assets/images/attack_area.png');
    this.load.image('bomb', 'assets/images/bomb.png');
  }

}

export default BootScene;
