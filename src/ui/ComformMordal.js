export default class ComformMordal extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {
    super(config.scene);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    let baseRect = new Phaser.Geom.Rectangle(0, 0, config.scene.game.config.width, 40);
    let base = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );  
    base.fillRectShape(baseRect);
    // base.depth = 100;
    base.alpha = 0.75;
    // this.container.setActive(false);

    this.container = this.scene.add.container();

    this.container.setVisible(false);

    this.target;

    this.container.x = 0;
    this.container.y = 0;

    this.container.depth = 100; 

    this.mordalText = this.scene.add.text(
      base.width/2,
      10,
      '',
      { font: '10px Courier', fill: '#FFFFFF' }
    );
    this.btn_yes = this.scene.add.text(
      10,
      25,
      'はい',
      { font: '10px Courier', fill: '#FFFFFF' }
    );

    this.btn_yes.setInteractive();
    this.btn_yes.on('pointerdown', function (pointer) {            
      this.target.beforePosition = {
        x: this.target.x,
        y: this.target.y
      };
      this.modelClose();
    },this);

    this.btn_no = this.scene.add.text(
      100,
      25,
      'いいえ',
      { font: '10px Courier', fill: '#CCC' }
    );
    this.btn_no.setInteractive();
    this.btn_no.on('pointerdown', function (pointer) {   

      this.target.setResetAll();

      this.modelClose();
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
  modelOpen(object){

    this.target = object;

    this.mordalText.setText(
      [
        '移動しますか？',
      ]
    );
    this.container.setVisible(true);
    this.container.x = 0;
    this.mordalText.x = 0;

    if(object.y < this.scene.game.config.height/2){
      //画面半分より上にあるとき　
      console.log("画面半分より上にあるとき")
      this.container.y = this.scene.game.config.height - 80;
    }else{
      //画面半分より下にあるとき　
      console.log("画面半分より下にあるとき")
      this.container.y = 20;
    }
  }
  modelClose(){
    this.target.removeMoveArea();
    // this.container.setActive(false);
    this.container.setVisible(false);
  }
  searchPostion(){
    // this.scene.
  }
}
  