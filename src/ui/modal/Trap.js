import Base from './Base';
export default class Trap extends Base{
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.textData = {
      lead: "トラップを配置しますか？",
      yes: "はい",
      no: "いいえ"
    };
  }
  setYes(){
    let manager = this.scene.stageManager;
    // manager.CHESS_STATUS = "TRAP_SET";
    this.close();
    manager.modalYes();
  }
}