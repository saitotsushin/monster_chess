class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    });
  }
  preload() {
    this.make.text({
      x: this.sys.game.config.width/2,
      y: 50,
      text: 'LOADING...',
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontSize: 6,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center'
      }
    });
    let progressNumb = this.make.text({
      x: this.sys.game.config.width/2,
      y: 60,
      text: '',
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontSize: 8,
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
      this.scene.start('MainScene');
    });


    //start loading
    this.load.pack('Preload', 'assets/pack.json', 'Preload');

    this.load.bitmapFont('bitmapFont', 'assets/font/font.png', 'assets/font/font.xml');
    this.load.bitmapFont('bitmapFontRed', 'assets/font/font_red.png', 'assets/font/font.xml');
    this.load.bitmapFont('bitmapFontBlue', 'assets/font/font_blue.png', 'assets/font/font.xml');

    this.load.spritesheet('anime_explode', 'assets/images/anime_explode.png', { frameWidth: 20, frameHeight: 20 }); 
    this.load.spritesheet('anime_attack', 'assets/images/anime_attack.png', { frameWidth: 20, frameHeight: 20 }); 

    this.load.image('tiles', 'assets/tilemaps/tile.png');
    // this.load.image('chess', 'assets/images/chess.png');
    // this.load.image('chess_1', 'assets/images/chess_1.png');
    // this.load.image('chess_2', 'assets/images/chess_2.png');
    // this.load.image('chess_3', 'assets/images/chess_3.png');
    // this.load.image('chess_4', 'assets/images/chess_4.png');
    // this.load.image('chess_5', 'assets/images/chess_5.png');
    // this.load.image('set_area', 'assets/images/set_area.png');
    // this.load.image('move_area', 'assets/images/move_area.png');
    // this.load.image('attack_move_area', 'assets/images/attack_move_area.png');
    // this.load.image('attack_area', 'assets/images/attack_area.png');
    // this.load.image('bomb', 'assets/images/bomb.png');
    // this.load.image('portion', 'assets/images/portion.png');
    // this.load.image('add_team_panel', 'assets/images/add_team_panel.png');
    this.load.atlas('spritesheet', 'assets/images/spritesheet.png', 'assets/sprites.json');
  }

}

export default BootScene;
