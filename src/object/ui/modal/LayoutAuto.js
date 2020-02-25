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
    this.scene.StageManager.STATUS.STAGE = "LAYOUT_AUTO";
    //保存していた配列
    this.scene.StageManager.modalYes();
  }
}