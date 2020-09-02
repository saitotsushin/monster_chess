
export default class Base extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(
      config.scene,
      config.x,
      config.y,
      config.key,
      config.frame,
      config.groupIndex
    );

    this.scene = config.scene;

    this.groupIndex = config.groupIndex;
    this.setInteractive();
    /*アイテムのフレーム*/
    this.item_frame = this.scene.add.sprite(this.x,this.y,'spritesheet','item_frame');
    this.item_frame.setVisible(false);

    this.setted = false;
    // this.setInteractive();

    // config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.status = {
      power: 100
    }
    this.damageText = this.scene.add.text(
      this.x + this.width/2 - 10,
      this.y + this.height/2 - 10,
      '0',
      { font: '15px Courier', fill: '#FF0000' }
    ); 
    this.damageText.depth = 12;
    this.damageText.setVisible(false);

    // this.Window = this.scene.add.sprite(
    //   0,
    //   0,
    //   'spritesheet',
    //   'window_base'
    // );

  }

  removeitem(){
    this.destroy();
  }
}
