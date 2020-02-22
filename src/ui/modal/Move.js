import Base from './Base';
import * as StageFunc from '../../plugin/StageFunc';
export default class Move extends Base{
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.textData = {
      lead: "移動しますか？",
      yes: "はい",
      no: "いいえ"
    };
  }
  setYes(){
    let manager = this.scene.stageManager;
    let player = this.scene.Player;
    player.selectedChess.move(
      manager.touchedPos.x,
      manager.touchedPos.y,
      player.selectedChess
    );
    StageFunc.updateTileProp(
      {
        afterPos: {
          x: manager.touchedPos.x,
          y: manager.touchedPos.y,
        },
        beforePos: {
          x: manager.beforeChessPos.x,
          y: manager.beforeChessPos.y,
        },
        stageData: this.scene.stageData,
        moveArea: manager.moveArea,
        chess: player.selectedChess
      }
    );
    manager.moveArea.hide();
    this.scene.STAGE_STATUS = "";
    this.scene.CHESS_STATUS = "FIN";
    manager.modalYes();
  }
}