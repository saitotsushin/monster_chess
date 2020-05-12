

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
    this.container.depth = 300;
    this.container.setVisible(false);
    this.close();
  }
  /*============
  モーダル
  ============*/
  setYes(){
    this.scene.updateStageTrap('ADD');
    this.scene.menuWindow("ITEM","CLOSE");
    this.close();
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
  