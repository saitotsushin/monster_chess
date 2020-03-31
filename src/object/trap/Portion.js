import Base from './Base';
export default class Portion extends Base {

  constructor(config) {

    super(config);

    this.scene = config.scene;

    this.depth = 5;

    this.x = config.x;

    this.y = config.y;

    this.itemTYPE = 'CURE';

    this.isSet = false;

    this.setInteractive();
    
    this.on('pointerdown', () => {
      
      this.scene.StageManager.STATUS.STAGE = "SELECTED_TRAP"
      this.scene.PlayerManager.selectedTrap = this;
      this.scene.StageManager.MoveArea.hide(this.scene.StageManager.selectedChess);
      // this.scene.ModalManager.open();
    },this);  
  }
  firing(cureTarget){

    let curePoint = Math.floor(cureTarget.status.maxHp * 0.5);//切り捨て
    let nowHp = cureTarget.status.hp + curePoint;
    let maxHp = cureTarget.status.maxHp;
    if(nowHp > maxHp){
      cureTarget.status.hp = maxHp;
    }else{
      cureTarget.status.hp += curePoint;
    }
    cureTarget.damage(curePoint,'CURE');
  }  
}