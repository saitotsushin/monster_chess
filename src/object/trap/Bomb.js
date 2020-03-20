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
      
      this.scene.StageManager.STATUS.STAGE = "SELECTED_TRAP"
      this.scene.PlayerManager.selectedTrap = this;
      this.scene.StageManager.MoveArea.hide(this.scene.StageManager.selectedChess);
      // this.scene.ModalManager.open();
    },this);  
  }
}