import Base from './Base';
// import Network from '../stage/Network';
export default class Bomb extends Base {

  constructor(config) {

    super(config);

    this.scene = config.scene;


    this.depth = 5;

    this.x = config.x;

    this.y = config.y;

    this.itemTYPE = 'ATTACK';

    this.fireType = 'STEP_ON';

    this.isSet = false;

  }
  firing(attackingTarget){

    // if(this.scene.registry.list.gameMode === "NET"){
    //   this.scene.StageManager.Network.fireditem(
    //     attackingTarget.groupIndex,
    //     attackingTarget.playerType,
    //     attackingTarget.pos
    //   );
    // }
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