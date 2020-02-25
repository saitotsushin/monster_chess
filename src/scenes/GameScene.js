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
    this.StageManager = new StageManager({
      scene: this
    });
    this.ModalManager = new ModalManager({
      scene: this
    });
    this.ModalManager.open();

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
    this.debugText.alpha = 0.3;

  }

  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    this.debugText.setText(
      [
        'STATUS.STAGE :'+this.StageManager.STATUS.STAGE,
        'STATUS.CHESS :'+this.StageManager.STATUS.CHESS,
        'STATUS.TURN  :'+this.StageManager.STATUS.TURN,
      ]
    );

    /*------------------------------
    デバッグ END
    ==============================*/
  }
  

}

export default GameScene;
