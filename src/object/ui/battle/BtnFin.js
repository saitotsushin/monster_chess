export default class BtnFin extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key,config.frame);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.scene = config.scene;
    this.STATUS = "";
    this.depth = 5
    
    this.setInteractive();
    this.on('pointerdown', () => {
      if(this.STATUS === "FIN"){
        this.scene.turnFin();
      }
      // if(this.scene.StageManager.STATUS.STAGE === 'LAYOUT'){
      //   return;
      // }
      // if(this.scene.StageManager.STATUS.MOVE === "FIN" || this.scene.StageManager.STATUS.ATTACK === "FIN"){
      //   this.scene.StageManager.turnFin();
      // }
    },this);


  }
}
