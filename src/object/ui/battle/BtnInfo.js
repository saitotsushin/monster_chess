export default class BtnInfo extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key,config.frame);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.scene = config.scene;

    this.toggleFlg = false;

    this.depth = 5
    
    this.setInteractive();
    this.on('pointerdown', () => {
      // this.scene.Menu.infoOpen();
      if(this.toggleFlg === false){
        this.toggleFlg = true;
        this.scene.menuWindow("INFO","OPEN");
        this.setTexture('spritesheet','btn_info_close');  
      }else{
        this.toggleFlg = false;
        this.scene.menuWindow("INFO","CLOSE");
        this.setTexture('spritesheet','btn_info2');
      }
    },this);
  }
  resetStatus(){
    this.toggleFlg = false;
    this.setTexture('spritesheet','btn_info2');
  }
}
