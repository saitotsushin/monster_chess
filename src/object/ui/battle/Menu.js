// import ModalItem from './modal/ModalItem';
import BtnItem from './BtnItem';
import BtnFin from './BtnFin';

export default class Menu {
  constructor(config) {
    this.scene = config.scene;
    this.BtnItem;
  }
  initScene(){
    this.flgItem = false;
    this.flgInfo = false;
    
    // /*==================
    // アイテムウインドウ
    // ==================*/    
    // this.ModalItem = new ModalItem({
    //   scene: this.scene
    // }); 
    /*==================
    モーダル
    ==================*/
    // this.ModalWindow = this.scene.add.sprite(
    //   76,
    //   184,
    //   'spritesheet',
    //   'window_info'
    // );
    // this.ModalWindow.setVisible(false);

    /*==================
    ボタン：アイテム
    ==================*/
    this.BtnItem = new BtnItem({
      scene: this.scene,
      x: 15,
      y: 194,
      key: 'spritesheet',
      frame: 'btn_return'
    });
    this.BtnItem.setVisible(false)
    /*==================
    ボタン：完了
    ==================*/
    this.BtnFin = new BtnFin({
      scene: this.scene,
      x: 145,
      y: 194,
      key: 'spritesheet',
      frame: 'btn_fin'
    });   
    /*==================
    スタート
    ==================*/
    this.hide();
    // this.show();
  }
  /*==================
  ボタンイベント：アイテム
  ==================*/  
  itemOpen(){
  }
  /*==================
  ボタンイベント：インフォ
  ==================*/   
  infoOpen(){
    // this.ModalWindow.setVisible(true);
  }
  /*==================
  ボタンステータス：完了
  ==================*/   
  btnChangeStatus(mode){
    if(mode === "FIN"){
      this.BtnFin.setTexture('spritesheet','btn_fin_on');
      this.BtnFin.STATUS = "FIN";
    }
    if(mode === "TURN_FIN"){
      this.BtnFin.setTexture('spritesheet','btn_fin');
      this.BtnFin.STATUS = "";
    }    
  }
  /*==================
  ボタンイベント：完了
  ==================*/   
  finOpen(){
  }
  /*==================
  クローズイベント
  ==================*/     
  close(){
  }
  /*==================
  表示
  ==================*/    
  show(){
    this.BtnFin.setVisible(true);
  }
  /*==================
  非表示
  ==================*/    
  hide(){
    this.BtnFin.setVisible(false);    
  }
  /*==============================
  アイテム選択中
  ------------------------------*/   
  touchItem(){
    this.BtnItem.show();
  }
   
}