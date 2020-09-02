

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
      'window_base'
    );
    this.ModalWindowText = this.scene.add.text(
      this.scene.game.config.width/2 * -1 + 10, 
      -12,
      ['攻撃しますか？'],
      {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10,
      lineSpacing: 0
     }
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
      this.ModalWindowText,
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
  