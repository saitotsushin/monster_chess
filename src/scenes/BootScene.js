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
      this.scene.start('TitleScene');
    });


    //start loading
    this.load.pack('Preload', 'assets/pack.json', 'Preload');

    this.load.bitmapFont('bitmapFont', 'assets/font/font.png', 'assets/font/font.xml');
    this.load.bitmapFont('bitmapFontWhite', 'assets/font/font_white.png', 'assets/font/font.xml');
    this.load.bitmapFont('bitmapFontRed', 'assets/font/font_red.png', 'assets/font/font.xml');
    this.load.bitmapFont('bitmapFontBlue', 'assets/font/font_blue.png', 'assets/font/font.xml');

    this.load.spritesheet('anime_explode', 'assets/images/anime_explode.png', { frameWidth: 20, frameHeight: 20 }); 
    this.load.spritesheet('anime_attack', 'assets/images/anime_attack.png', { frameWidth: 20, frameHeight: 20 }); 

    this.load.image('tiles', 'assets/tilemaps/tile.png');
    this.load.atlas('spritesheet', 'assets/images/spritesheet.png', 'assets/sprites.json');

    /*==============================
    使用するデータ
    ------------------------------*/
    /*自分のデータ*/
    this.registry.set('chessLayoutData', []);
    this.registry.set('chessData', []);
    this.registry.set('itemData', []);

    this.registry.set('stockData', []);

    /*相手のデータ*/    
    this.registry.set('chessLayoutData2', []);
    this.registry.set('chessData2', []);    
    this.registry.set('itemData2', []);

    /*共通*/
    this.registry.set('mapData', []);//マップのデータ
    this.registry.set('gameMode', '');//NPC or NET
  }

}

export default BootScene;
