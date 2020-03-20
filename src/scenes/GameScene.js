import ModalManager from '../object/ui/ModalManager';
import StageManager from '../object/StageManager';
import TrapManager from '../object/TrapManager';
import PlayerManager from '../object/PlayerManager';
import ChessManager from '../object/ChessManager';

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'GameScene'
    });
  }
  create(){
    this.ModalManager = new ModalManager({
      scene: this
    });
    this.StageManager = new StageManager({
      scene: this
    });

    this.TrapManager = new TrapManager({
      scene: this
    });

    this.ChessManager = new ChessManager({
      scene: this
    });
    
    this.PlayerManager = new PlayerManager({
      scene: this
    });
    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.add.text(10, 10, '', { font: '10px Courier', fill: '#FFFFFF' });
    this.debugText.depth = 100;
    this.debugText.setScrollFactor(0,0);
    this.debugText.alpha = 0.8;

  }

  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    this.debugText.setText(
      [
        'STATUS.STAGE :'+this.StageManager.STATUS.STAGE,
        'STATUS.TURN  :'+this.StageManager.STATUS.TURN,
        'STA.P1.CNT:'+this.StageManager.STATUS.PLAYER1.CHESS_COUNT+'|STA.P2.CNT:'+this.StageManager.STATUS.PLAYER2.CHESS_COUNT,
      ]
    );

    /*------------------------------
    デバッグ END
    ==============================*/
  }
  

}

export default GameScene;
