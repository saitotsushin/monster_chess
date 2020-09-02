

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
      2,
      0,
      'spritesheet',
      'window_base'
    );
    this.ModalWindowItemSetText = this.scene.add.text(
      this.scene.game.config.width/2 * -1 + 10, 
      -12, 
      ['配置しますか？'],
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
      this.ModalWindowItemSetText,
      this.btnYes,
      this.btnNo
    ]);
    this.container.x = this.scene.game.config.width/2;
    this.container.y = 198;
    this.container.depth = 200;
    // this.container.setVisible(false);
    this.close();
  }
  /*============
  モーダル
  ============*/
  setYes(){
    this.scene.itemWindow('YES',"ITEM","CLOSE");
    // this.scene.updateStageTrap('ADD');
    // this.scene.menuWindow("ITEM","CLOSE");
    this.close();
  }
  setNo(){
    this.scene.itemWindow('NO','ITEM','CLOSE');
    this.close();
  }
  open(){
    this.container.setVisible(true);

  }
  close(){
    this.container.setVisible(false);

  }
}
  