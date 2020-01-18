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
      this.modelClose();
      this.target.setModalYes();         
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
      this.modelClose();
      this.target.setModalNo();  
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

  modelOpen(){


    this.setVisible(true);
    this.container.setVisible(true);
    this.container.x = 0;
    this.mordalText.x = 0;
    this.mordalText.y = 0;

  }
  modelClose(){
    // this.target.setModalNo();
    // this.container.setActive(false);
    this.setVisible(false);
    this.container.setVisible(false);
  }
  searchPostion(){
    // this.scene.
  }
  setModalYes(){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        // monster.alpha = 0.5;
        monster.isPick = false;
        monster.removeMoveArea();
        // monster.isPick = false;
        monster.beforePosition.x = monster.x;
        monster.beforePosition.y = monster.y;   
        // sprite.update(time, delta);
      }
    ); 
  }
  setModalNo(){
    console.log("no comformModle");
  }
}
  