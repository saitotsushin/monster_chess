import Base from './Base';
export default class Attack extends Base{
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.textData = {
      lead: "攻撃しますか？",
      yes: "はい",
      no: "いいえ"
    };
  }
  setYes(){
    let manager = this.scene.stageManager;
    let player = this.scene.Player;
    player.selectedChess.attack(manager.enemyChess);
    this.scene.stageManager.moveArea.hide();
    this.close();
    this.scene.STAGE_STATUS = "";
    this.scene.CHESS_STATUS = "FIN";
    manager.modalYes();    
  }
}