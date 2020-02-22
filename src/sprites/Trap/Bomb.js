import Base from './Base';
export default class Bomb extends Base {

  constructor(config) {

    super(config);

    this.scene = config.scene;

    this.depth = 5;

    this.x = config.x;

    this.y = config.y;

    this.isSet = false;

    this.setInteractive();
    
    this.on('pointerdown', () => {
      
      this.scene.STAGE_STATUS = "SELECTED_TRAP"
      this.scene.Player.selectedTrap.object = this;
      this.scene.stageManager.moveArea.hide(this.scene.stageManager.selectedChess);
    },this);  
  }
}