export default class BtnItem extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key,config.frame);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.scene = config.scene;

    this.depth = 5;

    this.toggleFlg = false;
    
    this.setInteractive();
    this.on('pointerdown', () => {
      if(this.toggleFlg === false){
        this.toggleFlg = true;
        // this.scene.Menu.itemOpen();
        this.scene.menuWindow("ITEM","OPEN");
        this.depth = 110;
        this.setTexture('spritesheet','btn_item_close');  
      }else{
        this.toggleFlg = false;
        this.scene.menuWindow("ITEM","CLOSE");
        this.depth = 5;
        // this.scene.Menu.itemClose();
        this.setTexture('spritesheet','btn_item');
      }
    },this);
  }
  resetStatus(){
    this.toggleFlg = false;
    this.setTexture('spritesheet','btn_item');
  }
}

