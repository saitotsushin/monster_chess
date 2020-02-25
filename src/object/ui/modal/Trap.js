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
    let manager = this.scene.StageManager;
    manager.modalYes();
  }
}