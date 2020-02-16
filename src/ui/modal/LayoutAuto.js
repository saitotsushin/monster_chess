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
    this.scene.stageStatus = "SET_CHESS_FIN";
    this.scene.stageManager.mode = "set_fin";

    this.scene.setChess.finSet();
    let manager = this.scene.stageManager;
    //保存していた配列
    let setPlayer1_Arr = this.scene.stageData.player1Auto_Arr;
    let setPlayer2_Arr = this.scene.stageData.player2_Arr;
    let player1Group = this.scene.player1ChessGroup;
    let player2Group = this.scene.player2ChessGroup;
    console.log("player1Group",player1Group)
    manager.initSetChess(player1Group,setPlayer1_Arr);
    manager.initSetChess(player2Group,setPlayer2_Arr);

  }
}