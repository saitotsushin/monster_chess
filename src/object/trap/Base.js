
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

    this.configured = false;
    this.configuredPlayer = '';

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
  attack(attackingTarget){

    let damagePoint = this.status.power - attackingTarget.status.difence;

    attackingTarget.damage(damagePoint);
    attackingTarget.status.hp -= damagePoint;

    if(attackingTarget.status.hp <= 0){
      this.scene.StageManager.removeChess(attackingTarget);
    } 
  }  
  removeTrap(){
    this.destroy();
  }
}
