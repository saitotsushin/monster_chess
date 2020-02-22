import Base from './Base';
export default class Move extends Base{
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.textData = {
      lead: "完了ですか？",
      yes: "はい",
      no: "いいえ"
    };
  }
  setYes(){
    let manager = this.scene.stageManager;
    manager.CHESS_STATUS = "NEXT_TURN";
    this.close();
    manager.modalYes();
  }
}