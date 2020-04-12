export default class ChessInfoWindow{
  constructor(config) {

    this.scene = config.scene;
  }
  create(){
    this.ChessInfoContainer = this.scene.add.container(0, 0);
    this.ChessInfoMoveGroup = this.scene.add.group();
    /*=================
    チェスのインフォメーション
    -------------------*/
    /*チェスのウィンドウ
    -------------------*/
    this.ChessInfoWindow = this.scene.add.sprite(
      10,
      90,
      'spritesheet',
      'window_info_L'
    );
    this.ChessInfoWindow.setOrigin(0,0);
    /* チェスのウィンドウクローズ
    -------------------*/
    this.btnChessInfoWindowClose = this.scene.add.sprite(
      102,
      94,
      'spritesheet',
      'btn_close'
    );
    this.btnChessInfoWindowClose.setInteractive();
    this.btnChessInfoWindowClose.on('pointerdown', () => {
      this.scene.hideChessInfoWindow();
    }); 
    this.chessInfoImage = this.scene.add.sprite(
      55,
      111,
      'spritesheet',
      'chess_1'
    );
    this.chessInfoImage.scaleX = 2;
    this.chessInfoImage.scaleY = 2;
    this.chessInfoNumb = this.scene.add.bitmapText(
      14,
      113,
      'bitmapFont',
      '00',
      10
    );
    this.chessInfoNumb.setLetterSpacing = 2;
    this.chessInfoHp = this.scene.add.bitmapText(
      70,
      139,
      'bitmapFont',
      '00',
      10
    );
    this.chessInfoHp.setOrigin(1).setRightAlign();
    this.chessInfoAttack = this.scene.add.bitmapText(
      70,
      151,
      'bitmapFont',
      '000',
      10
    );
    this.chessInfoAttack.setOrigin(1).setRightAlign();
    this.chessInfoDifence = this.scene.add.bitmapText(
      70,
      163,
      'bitmapFont',
      '000',
      10
    );
    this.chessInfoDifence.setOrigin(1).setRightAlign();
    this.ChessInfoContainer.add(
      [
        this.ChessInfoWindow,
        this.btnChessInfoWindowClose,
        this.chessInfoNumb,
        this.chessInfoHp,
        this.chessInfoAttack,
        this.chessInfoDifence,
        this.chessInfoImage
      ]
    );
    for(var i = 0; i < 8;i++){
      for(var k = 0; k < 6; k++){

        let sprite = this.scene.add.sprite(
          k * 5 + 91 + k,
          i * 5 + 118 + i,
          'spritesheet',
          'movearea_s_default'
        );
        sprite.depth = 405;

        this.ChessInfoMoveGroup.add(sprite);

      }
    }
    

    this.ChessInfoContainer.depth = 400;

  }
  setChessInfo(chess){
    console.log("setChessInfo")
    this.chessInfoNumb.setText(chess.no);
    this.chessInfoHp.setText(chess.status.maxHp);
    this.chessInfoAttack.setText(chess.status.power);
    this.chessInfoDifence.setText(chess.status.difence);
    this.chessInfoImage.setTexture('spritesheet',chess.frame.name);
    this.getAreaMap(3,4,chess)

  }
  getAreaMap(X,Y,target){

    let base1 = target.areaMapBase;
    let base = [];
    if(target.playerType === "player2"){
      base = base1.slice().reverse();
    }else{
      base = base1;
    }
    let moveArea = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    let harfHeight = (base.length - 1) / 2;
    let harfWidth = (base[0].length - 1) / 2;
    let baseY = harfHeight - Y;
    let baseX = harfWidth - X;
    let i2 = 0;
    let k2 = 0;
    let centePos = {
      X: 0,
      Y: 0
    }

    let groupCount = 0;
    let ChessInfoMoveGroup = this.ChessInfoMoveGroup.children.entries;

    /*初期化*/
    for(var i = baseY; i < harfHeight + baseY + 1; i++){//縦（y）
      for(var k = baseX; k < harfWidth + baseX + 1; k++){//横（x）
        if(base[i][k] === 1){//移動
          moveArea[i2][k2] = base[i][k];
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_move');
        }
        if(base[i][k] === 2){//攻撃
          moveArea[i2][k2] = base[i][k];
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_attack');
        }
        if(base[i][k] === 3){//移動＆攻撃
          moveArea[i2][k2] = base[i][k];
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_move_attack');
        }
        if(base[i][k] === 9){
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_chess');
        }
        if(base[i][k] === 0){
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_default');
        }
        k2++;
        groupCount++;
      }
      k2 = 0;
      i2++;
    }
    
  }
}
