import Base from './Base';
export default class Move extends Base{
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.textData = {
      lead: "移動しますか？",
      yes: "はい",
      no: "いいえ"
    };
  }
  setYes(){
    let manager = this.scene.stageManager;
    manager.selectedChess.move(
      manager.touchedPos.x,
      manager.touchedPos.y,
      manager.selectedChess
    ); 
    manager.moveArea.hide();
    manager.searchAttackArea();
  }
}