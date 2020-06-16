import Base from './Base';
export default class Reflect extends Base {

  constructor(config) {

    super(config);

    this.scene = config.scene;

    this.depth = 5;

    this.x = config.x;

    this.y = config.y;

    this.itemTYPE = 'ATTACK';

    this.fireType = 'ATTACKED';

    this.isSet = false;
 
  }
  firing(attackingTarget){
    let damagePoint = this.status.power;

    attackingTarget.damage(damagePoint,'ATTACK');
    this.setVisible(false);
    attackingTarget.status.hp -= damagePoint;

    let _scene = attackingTarget.scene;

    if(attackingTarget.status.hp <= 0){
      let queRemove = setTimeout(function(){
        _scene.GameManager.removeChess(attackingTarget);
        clearTimeout(queRemove);
      }, 2500);
      attackingTarget.status.hp = 0;
    } 
  }  
}