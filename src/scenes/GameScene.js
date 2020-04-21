import ModalManager  from '../object/ui/ModalManager';
import StageManager  from '../object/StageManager';
import TrapManager   from '../object/TrapManager';
import PlayerManager from '../object/PlayerManager';
import ChessManager  from '../object/ChessManager';
import ClearGame     from '../object/ui/ClearGame';
import StageMenu     from '../object/StageMenu';

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'GameScene'
    });
  }
  create(){

    this.ChessManager = new ChessManager({
      scene: this
    });
    
    this.PlayerManager = new PlayerManager({
      scene: this
    });
    this.PlayerManager.create();
    this.registry.list.player1Auto_Arr = this.PlayerManager.player1Auto_Arr;

    this.ModalManager = new ModalManager({
      scene: this
    });
    this.StageManager = new StageManager({
      scene: this
    });
    this.StageManager.create();

    this.TrapManager = new TrapManager({
      scene: this
    });
    this.StageMenu = new StageMenu({
      scene: this
    });
    this.ClearGame = new ClearGame({
      scene: this
    });


    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.add.text(10, 10, '', { font: '8px Courier', fill: '#FFFFFF' });
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
        'STATUS.MOVE  :'+this.StageManager.STATUS.MOVE,
        'STATUS.ATTACK:'+this.StageManager.STATUS.ATTACK,
        'STATUS.TURN  :'+this.StageManager.STATUS.TURN,
        'PLAYER_NUMBER:'+this.PlayerManager.PLAYER_NUMBER,
        'ROOM ID      :'+global_roomID,
        // 'STA.P1.CNT:'+this.StageManager.STATUS.PLAYER1.CHESS_COUNT+'|STA.P2.CNT:'+this.StageManager.STATUS.PLAYER2.CHESS_COUNT,
      ]
    );

    /*------------------------------
    デバッグ END
    ==============================*/
  }
  
  /*==============================
  表示・非表示
  ------------------------------*/   
  /*ストックの駒
  ------------------------------*/
  showChessInfoWindow(){
    this.StageManager.ChessInfoWindow.ChessInfoContainer.setVisible(true);
    this.StageManager.ChessInfoWindow.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }

  hideChessInfoWindow(){
    this.StageManager.ChessInfoWindow.ChessInfoContainer.setVisible(false);
    this.StageManager.ChessInfoWindow.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
  }
}

export default GameScene;
