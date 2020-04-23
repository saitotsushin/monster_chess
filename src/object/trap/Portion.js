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

      this.scene.TrapManager.Cursor.setVisible(true);
      
      this.scene.TrapManager.Cursor.x = this.x + 5;
      this.scene.TrapManager.Cursor.y = this.y;
      
      // this.scene.StageManager.STATUS.STAGE = "SELECTED_TRAP"
      this.scene.PlayerManager.selectedTrap = this;
      this.scene.StageManager.MoveArea.hide(this.scene.StageManager.selectedChess);
      // this.scene.ModalManager.open();
    },this);  
  }
  firing(cureTarget){
    // if(this.scene.StageManager.STATUS.TURN !== this.scene.PlayerManager.PLAYER_NUMBER){

    if(this.scene.registry.list.gameMode === "NET"){
      console.log("cureTarget.groupIndex",cureTarget.groupIndex);
      console.log("playerType",cureTarget.playerType)
      console.log("cureTarget.pos",cureTarget.pos)
      this.scene.StageManager.Network.firedTrap(
        cureTarget.groupIndex,
        cureTarget.playerType,
        cureTarget.pos
      );
    }
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