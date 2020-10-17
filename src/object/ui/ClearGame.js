

export default class ClearGame extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {

    super(config.scene);

    this.visible = false;

    this.container = this.scene.add.container(0, 0);
    this.container.setScrollFactor(0);

    this.overlapArea = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );    
    this.rect = new Phaser.Geom.Rectangle(0, 0, config.scene.game.config.width, config.scene.game.config.height);
    this.overlapArea.fillRectShape(this.rect);
    this.overlapArea.alpha = 0.75;
    this.overlapArea.setScrollFactor(0);

    this.gettedChess = this.scene.add.sprite(0,0,'spritesheet','chess_shadow');
    this.gettedChess.setVisible(false);
    this.gettedChess.x = this.scene.game.config.width/2;
    this.gettedChess.y = 105;


    /*=================
    タイトル：結果
    -------------------*/
    /*-------------------
    勝ち
    -------------------*/
    this.titleResultWin = config.scene.add.sprite(
      config.scene.game.config.width/2,
      30,
      'spritesheet',
      'title_win'
    ); 
    this.titleResultWin.setOrigin(0.5,0.5);

    /*-------------------
    負け
    -------------------*/
    this.titleResultLose = config.scene.add.sprite(
      config.scene.game.config.width/2,
      30,
      'spritesheet',
      'title_lose'
    ); 
    this.titleResultLose.setOrigin(0.5,0.5);

    /*=================
    タイトル：ゲットチェス
    -------------------*/
    this.titleGetChess = config.scene.add.sprite(
      config.scene.game.config.width/2,
      80,
      'spritesheet',
      'title_getchess'
    ); 
    this.titleGetChess.setOrigin(0.5,0.5);

    /*=================
    ボタン：YES
    -------------------*/
    this.btnMenuBack = this.scene.add.sprite(
      this.scene.game.config.width/2,
      140,
      'spritesheet',
      'btn_menu_back'
    );
    this.btnMenuBack.setInteractive();
    this.btnMenuBack.on('pointerdown', function (pointer) {
      this.scene.scene.start('BattleScene');
    },this);

    /*=================
    コンテナー
    -------------------*/
    this.container.add([
      this.overlapArea,
      this.btnMenuBack,
      this.titleResultWin,
      this.titleResultLose,
      this.titleGetChess,
      this.gettedChess
    ]);
    this.container.depth = 500;

    /*=================
    初期化
    -------------------*/
    this.titleResultWin.setVisible(false)
    this.titleResultLose.setVisible(false)
    this.container.setVisible(false)

    /*test */
    // this.open();
    // this.getRandomChess();
    
    this.hide();


  }
  open(){
    this.show();
    this.container.setVisible(true)

    if(this.scene.STATUS.WIN_PLAYER === "player1"){
      this.titleResultWin.setVisible(true)
      this.titleResultLose.setVisible(false)
      /*=================
      ランダムで相手のチェスが手に入る
      -------------------*/    
      this.getRandomChess();
      this.scene.registry.list.floorNumber++;
    }
    if(this.scene.STATUS.WIN_PLAYER === "player2"){
      this.titleResultWin.setVisible(false)
      this.titleResultLose.setVisible(true)
      this.titleGetChess.setVisible(false)
    }
  }
  getRandomChess(){
    let _this = this;
    let getChessData2 = this.scene.LoadGameData.chessData2.filter(function(item, index){
      if (item.name == _this.scene.registry.list.floorNumber) return true;
    });
    let chessData2 = getChessData2[0].chessGroup;

    // let chessData2 = this.scene.GameManager.StageManager.LoadGameData.chessData2;
    let randomChess =  chessData2[Math.floor(Math.random() * chessData2.length)];
    this.gettedChess.setVisible(true);
    this.gettedChess.setTexture('spritesheet',randomChess);
    for(var i = 0; i < this.scene.registry.list.chessDataMaster.length; i++){
      if(this.scene.registry.list.chessDataMaster[i][0] === randomChess){
        if(this.scene.registry.list.chessDataMaster[i][1] < 5){
          this.scene.registry.list.chessDataMaster[i][1]++;
        }
      }
    }

  }  
  /*==============================
  表示・非表示
  ------------------------------*/   
  /*ストックの駒
  ------------------------------*/
  show(){
    // this.chessGroup.children.entries.forEach(
    //   (sprite) => {
    //     sprite.setVisible(true);
    //   }
    // );
  }
  hide(){
    // this.chessGroup.children.entries.forEach(
    //   (sprite) => {
    //     sprite.setVisible(false);
    //   }
    // );
  }
}
