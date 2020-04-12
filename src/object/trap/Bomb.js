import Base from './Base';
export default class Bomb extends Base {

  constructor(config) {

    super(config);

    this.scene = config.scene;

    this.depth = 5;

    this.x = config.x;

    this.y = config.y;

    this.itemTYPE = 'ATTACK';

    this.isSet = false;

    this.setInteractive();
    
    this.on('pointerdown', () => {

      this.scene.TrapManager.Cursor.setVisible(true);

      
      
      this.scene.TrapManager.Cursor.x = this.x + 5;
      this.scene.TrapManager.Cursor.y = this.y;

      
      // this.scene.StageManager.STATUS.STAGE = "SELECTED_TRAP"
      this.scene.PlayerManager.selectedTrap = this;
      this.scene.StageManager.MoveArea.hide(this.scene.StageManager.selectedChess);
      // this.scene.ModalManager.open();
    },this);  
  }
  firing(attackingTarget){

    let damagePoint = this.status.power - attackingTarget.status.difence;

    attackingTarget.damage(damagePoint,'ATTACK');
    attackingTarget.status.hp -= damagePoint;

    if(attackingTarget.status.hp <= 0){
      this.scene.StageManager.removeChess(attackingTarget);
    } 
  }  
}