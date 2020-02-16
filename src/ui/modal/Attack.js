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
    console.log("this.scene",this.scene)
    this.scene.stageManager.selectedChess.attack(this.scene.stageManager.enemyChess);
    this.scene.stageManager.moveArea.hide();
    this.scene.stageManager.searchAttackArea();
  }
}