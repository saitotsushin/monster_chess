import Base from './Base';
export default class SetFin extends Base{
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.textData = {
      lead: "スタートしますか？",
      yes: "はい",
      no: "いいえ"
    };
  }
  setYes(){
    this.scene.setChess.finSet();
    this.scene.stageManager.initSetChess(this.scene.player1ChessGroup,this.scene.stageData.player1_Arr);
    this.scene.stageManager.initSetChess(this.scene.player2ChessGroup,this.scene.stageData.player2_Arr);
  }
}