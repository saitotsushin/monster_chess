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

    this.isSet = false;

    this.setInteractive();
    
    this.on('pointerdown', () => {

      // this.scene.itemManager.Cursor.setVisible(true);

      
      // this.scene.itemManager.Cursor.x = this.x + 5;
      // this.scene.itemManager.Cursor.y = this.y;

      // this.scene.PlayerManager.selecteditem = this;
      // this.scene.StageManager.MoveArea.hide(this.scene.StageManager.selectedChess);

    },this);  
  }
  firing(attackingTarget){

    // if(this.scene.registry.list.gameMode === "NET"){
    //   this.scene.StageManager.Network.fireditem(
    //     attackingTarget.groupIndex,
    //     attackingTarget.playerType,
    //     attackingTarget.pos
    //   );
    // }

    // let damagePoint = this.status.power - attackingTarget.status.difence;

    // attackingTarget.damage(damagePoint,'ATTACK');
    // attackingTarget.status.hp -= damagePoint;

    // if(attackingTarget.status.hp <= 0){
    //   this.scene.StageManager.removeChess(attackingTarget);
    // } 
  }  
}