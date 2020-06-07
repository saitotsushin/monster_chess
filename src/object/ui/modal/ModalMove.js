

export default class ModalMove{
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
      'window_move'
    );
    /*=====================
    ボタン：YES
    =====================*/
    this.btnYes = this.scene.add.sprite(
      22,
      0,
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
      56,
      0,
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
    this.container.x = this.scene.game.config.width/2;
    this.container.y = 198;
    this.container.depth = 200;
    this.container.setVisible(false);
  }
  /*============
  モーダル
  ============*/
  setYes(){
    this.scene.actionChess('MOVE','YES');
    this.close();
  }
  setNo(){
    this.scene.actionChess('MOVE','NO');
    this.container.setVisible(false);
  }
  open(){
    this.container.setVisible(true);
  }
  close(){
    this.container.setVisible(false);
  }
}
  