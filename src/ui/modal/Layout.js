import Base from './Base';
export default class Layout extends Base{
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.textData = {
      lead: "配置しますか？",
      yes: "はい",
      no: "いいえ"
    };
  }
  setYes(){
    let target = this.scene.setChess;
    let pos = this.scene.stageManager.touchedPos;
    target.deployPosition(pos);
  }
}