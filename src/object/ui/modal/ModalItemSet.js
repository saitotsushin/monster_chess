import * as Prop      from '../../stage/FunctionStageProp';

export default class ModalItemSet{
  constructor(config) {

    this.scene = config.scene;
    this.create();
  }
  create(){
    this.container = this.scene.add.container();
    /*=====================
    window
    =====================*/
    this.Window = this.scene.add.sprite(
      0,
      0,
      'spritesheet',
      'window_item_set'
    );
    /*=====================
    ボタン：YES
    =====================*/
    this.btnYes = this.scene.add.sprite(
      8,
      -5,
      'spritesheet',
      'btn_yes'
    );
    this.btnYes.setInteractive();
    
    this.btnYes.on('pointerdown', () => {
      this.setYes();
    },this);
    /*=====================
    ボタン：NO
    =====================*/
    this.btnNo = this.scene.add.sprite(
      40,
      -5,
      'spritesheet',
      'btn_no'
    );
    this.btnNo.setInteractive();
    
    this.btnNo.on('pointerdown', () => {
      this.setNo();
    },this);
    this.container.add(
    [
      this.Window,
      this.btnYes,
      this.btnNo
    ]);
    this.container.x = 52;
    this.container.y = 186;
    this.container.depth = 210;
    this.Window.depth = 210;
    this.btnYes.depth = 210;
    this.btnNo.depth = 210;
    this.container.setVisible(false);
  }
  /*============
  モーダル
  ============*/
  setYes(){

    /*設置されたアイテムを更新*/
    this.scene.PlayerManager.selectedTrap.setted = true;
    // this.scene.PlayerManager.selectedTrap.removeInteractive();
    // this.scene.PlayerManager.player1ChessGroup.children.entries[this.scene.PlayerManager.selectedTrap.groupIndex].removeInteractive();

    let trapConfig = {
      scene: this.scene,
      selectedTrap: this.scene.PlayerManager.selectedTrap,
      index: this.scene.PlayerManager.selectedTrap.groupIndex,
      nextPos: {
        X: this.scene.StageManager.nextChessPos.X,
        Y: this.scene.StageManager.nextChessPos.Y
      }
    }
    Prop.setPropTrap(trapConfig);

    /*フッターメニューボタンのアイテムボタンのリセット*/
    this.scene.StageMenu.flgItem = false;
    this.scene.StageMenu.btnItem.setTexture('spritesheet','btn_item');
    this.scene.StageMenu.ModalItem.close();
    /*トラップマネージャーのウインドウをリセット*/
    this.scene.TrapManager.ModalItemSet.close();
    this.scene.TrapManager.Cursor.setVisible(false);

    this.scene.StageManager.STATUS.STAGE = "";
    this.scene.PlayerManager.selectedTrap = "";

    /*ウインドウのクローズ*/
    this.close();

    // this.scene.StageManager.moveChess(
    //   this.scene.PlayerManager.selectedChess,
    //   this.scene.StageManager.nextChessPos
    // );
    // this.close();
  }
  setNo(){
    this.container.setVisible(false);
  }
  open(){
    this.container.setVisible(true);
  }
  close(){
    this.container.setVisible(false);
  }
}
  