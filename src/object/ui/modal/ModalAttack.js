

export default class ModalAttack{
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
      'window_attack'
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
    this.container.depth = 200;
    this.container.setVisible(false);
  }
  /*============
  モーダル
  ============*/
  setYes(){
    this.scene.actionChess('ATTACK','YES');
    this.close();
  }
  setNo(){
    this.scene.actionChess('ATTACK','NO');
    this.close();
  }
  open(){
    this.container.setVisible(true);
  }
  close(){
    this.container.setVisible(false);
  }
}
  