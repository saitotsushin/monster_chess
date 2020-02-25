
export default class Base extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(
      config.scene,
      config.x,
      config.y,
      config.key,
      config.groupIndex
    );

    this.scene = config.scene;

    this.groupIndex = config.groupIndex;

    config.scene.physics.world.enable(this);
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
  }
  damage(chess,pos){
    let damagepoint =  this.status.power - chess.status.difence;
    if(damagepoint < 0){
      damagepoint = 0;
    }
    chess.status.hp -= damagepoint;

    if(chess.status.hp <= 0){
      this.scene.stageManager.removeChess(chess);
    } 

    this.damageText.x = chess.x + 10;
    this.damageText.y = chess.y - 10;

    let afterY = this.damageText.y + 10;
    this.damageText.setVisible(true);
    this.damageText.setText(String(damagepoint));
    let damageTween = this.scene.tweens.add({
        targets: this.damageText,
        y: afterY,
        ease: 'liner',
        duration: 100,
        repeat: 0,
        completeDelay: 1000,
        onComplete: function () {
          this.damageText.setVisible(false);
        },
        callbackScope: this
    });


  }
}
