export default class BtnItem extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key,config.frame);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.scene = config.scene;

    this.depth = 5;
    
    this.setInteractive();
    this.on('pointerdown', () => {
      this.hide();
      this.scene.setItemCancel();
    },this);
  }
  resetStatus(){
    this.toggleFlg = false;
    this.setTexture('spritesheet','btn_item');
  }
  show(){
    this.setVisible(true);
  }
  hide(){
    this.setVisible(false);
  }
}

