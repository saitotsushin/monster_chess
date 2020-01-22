export default class ComformMordal extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {
    super(config.scene);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.target;

    // this.modelText = "テキスト";
    this.modelText = {
      default: {
        text: "配置しますか？",
        yes: "はい",
        no: "いいえ"
      } 
    };
    
    let baseRect = new Phaser.Geom.Rectangle(0, 0, config.scene.game.config.width, 40);
    let base = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );  
    base.fillRectShape(baseRect);
    base.alpha = 0.75;

    this.container = this.scene.add.container();
    this.setVisible(false);
    this.container.setVisible(false);


    this.container.x = 0;
    this.container.y = 0;

    this.container.depth = 100; 

    this.mordalText = this.scene.add.text(
      base.width/2,
      10,
      this.modelText.default.text,
      { font: '10px Courier', fill: '#FFFFFF' }
    );

    this.btn_yes = this.scene.add.text(
      10,
      25,
      this.modelText.default.yes,
      { font: '10px Courier', fill: '#FFFFFF' }
    );

    this.btn_yes.setInteractive();
    this.btn_yes.on('pointerdown', function (pointer) {
      // this.target.beforePosition = {
      //   x: this.target.x,
      //   y: this.target.y
      // };
      this.close();
      this.setModalYes();         
    },this);

    this.btn_no = this.scene.add.text(
      100,
      25,
      this.modelText.default.no,
      { font: '10px Courier', fill: '#CCC' }
    );

    this.btn_no.setInteractive();

    this.btn_no.on('pointerdown', function (pointer) {   
      // this.target.setResetAll();
      this.close();
      this.setModalNo();  
    },this);
    // this.mordalText = base.width/2
    this.mordalText.depth = 101;

    this.container.add(
      [
        base,
        this.mordalText,
        this.btn_yes,
        this.btn_no
      ]
    );    
  }
  setTarget(object){
    this.target = object;
  }
  resetModalText(){
    this.mordalText.setText(this.modelText.default.text);
    this.btn_yes.setText(this.modelText.default.yes);
    this.btn_no.setText(this.modelText.default.no);    
  }

  open(){

    switch (this.scene.monsterStatus) {
      case 'attack':
        this.mordalText.setText("攻撃しますか？")
        break;
        case 'move':
          this.mordalText.setText("移動しますか？")
          break;        
      default:
        console.log('ComformMordal not setting mode!');
    }

    this.setVisible(true);
    this.container.setVisible(true);
    this.container.x = 0;
    this.mordalText.x = 0;
    this.mordalText.y = 0;

  }
  close(){
    // this.target.setModalNo();
    // this.container.setActive(false);
    this.setVisible(false);
    this.container.setVisible(false);
  }
  searchPostion(){
    // this.scene.
  }
  setModalYes(){
    this.scene.setMoveAreaResetAll();

    if(this.scene.monsterStatus === "attack"){
      /*
      TODO
      ダメージを与える
      */
    }
    if(this.scene.monsterStatus === "move"){
      /*
      ステージ上の駒の位置（Player1）の更新（前の位置をクリアする）      
      #TODO
      あとでPlayer2も位置の更新ができるようにする
      */
      let beforPos = {
        x: this.scene.pickChess.beforePosition.x - this.scene.pickChess.width/2,
        y: this.scene.pickChess.beforePosition.y - this.scene.pickChess.height/2
      }
      let setBeforPos = this.scene.getMonsterPostion(beforPos);

      this.scene.tilePropertyArr[setBeforPos.y][setBeforPos.x] = 0;
      this.scene.player1_Arr[setBeforPos.y][setBeforPos.x] = 0;

      /*移動後の位置の保存*/
      this.scene.pickChess.beforePosition.x = this.scene.pickChess.x;
      this.scene.pickChess.beforePosition.y = this.scene.pickChess.y;

      let afterPos = {
        x: this.scene.pickChess.x - this.scene.pickChess.width/2,
        y: this.scene.pickChess.y - this.scene.pickChess.height/2
      }
      let setAferPos = this.scene.getMonsterPostion(afterPos);
      /*ステージの駒の更新*/
      this.scene.tilePropertyArr[setAferPos.y][setAferPos.x] = {
        object: this.scene.pickChess
      };

      this.scene.player1_Arr[setAferPos.y][setAferPos.x] = 1;

      /*モンスターの位置を更新*/
      /*
      #TODO
      */

      // this.scene.setMonster();
      // this.scene.pickChess.MoveArea.initSetPosition(this.scene.pickChess)

      /*初期化*/
      this.scene.pickChess = null;
    }


    // if(this.turn === "PLAYER1"){

    this.scene.turn = this.scene.turn === "PLAYER1" ? "PLAYER2" : "PLAYER1";
    this.scene.NPC_turn();
  }
  setModalNo(){
    console.log("no comformModle");
  }
}
  