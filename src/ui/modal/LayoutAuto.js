import Base from './Base';
export default class LayoutAuto extends Base{
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.textData = {
      lead: "オート配置しますか？",
      yes: "はい",
      no: "いいえ"
    };
  }
  setYes(){
    this.scene.STAGE_STATUS = "LAYOUT_FIN";
    this.scene.setChess.finSet();
    let manager = this.scene.stageManager;
    //保存していた配列
    manager.modalYes();
  }
}