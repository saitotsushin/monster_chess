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
      this.close();
      this.scene.stageManager.setModalYes();         
    },this);

    this.btn_no = this.scene.add.text(
      100,
      25,
      this.modelText.default.no,
      { font: '10px Courier', fill: '#CCC' }
    );

    this.btn_no.setInteractive();

    this.btn_no.on('pointerdown', function (pointer) {   
      this.close();
      this.scene.stageManager.setModalNo();         
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

  setMessage(config){
    let text = config.text ? config.text : "undefined";
    let yes = config.yes ? config.yes : "はい";
    let no = config.no ? config.no : "いいえ";
    this.mordalText.setText(text);
    this.btn_yes.setText(yes);
    this.btn_no.setText(no);
  }

  open(){

    this.setVisible(true);
    this.container.setVisible(true);
    this.container.x = 0;
    this.mordalText.x = 0;
    this.mordalText.y = 0;

  }
  close(){
    this.setVisible(false);
    this.container.setVisible(false);
  }
}
  