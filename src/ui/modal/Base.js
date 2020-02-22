

export default class Base extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {
    super(config);

    this.scene = config;

    this.target;

    // this.CHESS_STATUSlText = "テキスト";
    this.textData = {
      lead: "デフォルトテキスト",
      yes: "はい",
      no: "いいえ"
    };
    
    let baseRect = new Phaser.Geom.Rectangle(0, 0, config.game.config.width, 40);
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
      this.textData.lead,
      { font: '10px Courier', fill: '#FFFFFF' }
    );

    this.btn_yes = this.scene.add.text(
      10,
      25,
      this.textData.yes,
      { font: '10px Courier', fill: '#FFFFFF' }
    );

    this.btn_yes.setInteractive();
    this.btn_yes.on('pointerdown', function (pointer) {
      this.close();
      this.setYes();         
    },this);

    this.btn_no = this.scene.add.text(
      100,
      25,
      this.textData.no,
      { font: '10px Courier', fill: '#CCC' }
    );

    this.btn_no.setInteractive();

    this.btn_no.on('pointerdown', function (pointer) {   
      this.close();
      this.setNo();         
    },this);
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
  /*============
  モーダル
  ============*/
  setYes(){
  }
  setNo(){
    if(this.scene.STAGE_STATUS === "SET_CHESS_FIN"){
      this.scene.STAGE_STATUS = "SET_CHESS";
    }
    this.CHESS_STATUS = "";
  }
  open(){
    this.mordalText.setText(this.textData.lead);
    this.btn_yes.setText(this.textData.yes);
    this.btn_no.setText(this.textData.no);
    this.setVisible(true);
    this.container.setVisible(true);
    this.container.x = 0;
    this.mordalText.x = 0;
    this.mordalText.y = 0;
    this.scene.modalManager.openModal = this;

  }
  close(){
    this.setVisible(false);
    this.container.setVisible(false);
    this.scene.modalManager.openModal = "";
  }
}
  