

export default class ClearGame extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {

    super(config.scene);

    this.visible = false;

    this.container = this.scene.add.container(0, 0);
    this.container.depth = 100;
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
    チェスグループの表示
    -------------------*/
    this.chessGroup = this.scene.add.group();
    this.createPlayerGroup();

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
    ボタン：メニュー画面に戻る
    -------------------*/
    this.btnMenu = config.scene.add.sprite(
      config.scene.game.config.width/2,
      150,
      'spritesheet',
      'btn_menu_L'
    ); 
    this.btnMenu.setOrigin(0.5,0.5);
    this.btnMenu.setInteractive();
    this.btnMenu.on('pointerdown', () => {
      this.scene.scene.start('MenuScene');
    });  
    /*=================
    コンテナー
    -------------------*/
    this.container.add([
      this.overlapArea,
      this.titleResultWin,
      this.titleResultLose,
      this.titleGetChess,
      this.btnMenu
    ]);
    this.container.depth = 300;

    /*=================
    初期化
    -------------------*/
    this.titleResultWin.setVisible(false)
    this.titleResultLose.setVisible(false)
    this.container.setVisible(false)

    /*test */
    // this.open();
    this.hide();


  }
  open(){
    this.show();
    this.container.setVisible(true)
    if(this.scene.StageManager.STATUS.WIN_PLAYER === "player1"){
      this.titleResultWin.setVisible(true)
      this.titleResultLose.setVisible(false)
      /*=================
      ランダムで相手のチェスが手に入る
      -------------------*/    
      this.getRandomChess();
    }
    if(this.scene.StageManager.STATUS.WIN_PLAYER === "player2"){
      this.titleResultWin.setVisible(false)
      this.titleResultLose.setVisible(true)
      this.titleGetChess.setVisible(false)
    }
  }
  createPlayerGroup(){
    let chessDataList = this.scene.ChessManager.ChessData.chessList;
    let playerChessList = this.scene.PlayerManager.player1_ChessList;
    let group = this.chessGroup;
    let sprite;

    for(var i = 0; i < playerChessList.length; i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          sprite = this.scene.ChessManager.createChess(
            item.className,
            item.key
          );
          sprite.x = i * 20 + 20 + 10;
          sprite.y = 54;
          sprite.depth = 310;
          group.add(sprite);
        }
      },this);

    }

  }
  getRandomChess(){
    let chessDataList = this.scene.ChessManager.ChessData.chessList;
    let getPlayerChessList = this.scene.PlayerManager.player2_ChessList;
    let sprite;

    let randomChess = getPlayerChessList[Math.floor(Math.random() * getPlayerChessList.length)];
    let playerChessList = [randomChess];

    for(var i = 0; i < playerChessList.length; i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          sprite = this.scene.ChessManager.createChess(
            item.className,
            item.key
          );
          sprite.x = 70;
          sprite.y = 106;
          sprite.depth = 310;
          // group.add(sprite);
        }
      },this);

    }
    this.scene.registry.list.stockChesses.push(randomChess);


  }
  /*==============================
  表示・非表示
  ------------------------------*/   
  /*ストックの駒
  ------------------------------*/
  show(){
    this.chessGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }
  hide(){
    this.chessGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
  }
}
