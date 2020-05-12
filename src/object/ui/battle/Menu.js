// import ModalItem from './modal/ModalItem';
import BtnItem from './BtnItem';
import BtnInfo from './BtnInfo';
import BtnFin from './BtnFin';

export default class Menu {
  constructor(config) {
    this.scene = config.scene;
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
    this.ModalWindow = this.scene.add.sprite(
      76,
      184,
      'spritesheet',
      'window_info'
    );
    this.ModalWindow.setVisible(false);

    /*==================
    ボタン：アイテム
    ==================*/
    this.BtnItem = new BtnItem({
      scene: this.scene,
      x: 20,
      y: 184,
      key: 'spritesheet',
      frame: 'btn_item'
    }); 

    /*==================
    ボタン：インフォ
    ==================*/
    this.BtnInfo = new BtnInfo({
      scene: this.scene,
      x: 41,
      y: 184,
      key: 'spritesheet',
      frame: 'btn_info2'
    }); 

    /*==================
    ボタン：完了
    ==================*/
    this.BtnFin = new BtnFin({
      scene: this.scene,
      x: 116,
      y: 184,
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
    console.log("itemOpen");
  }
  itemClose(){
    console.log("itemClose");
  }  
  /*==================
  ボタンイベント：インフォ
  ==================*/   
  infoOpen(){
    console.log("infoOpen");
  }
  infoClose(){
    console.log("infoClose");
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
    console.log("finOpen");
  }
  /*==================
  クローズイベント
  ==================*/     
  close(){
    this.BtnItem.resetStatus();
    this.BtnInfo.resetStatus();
    console.log("resetOpen");
  }
  /*==================
  表示
  ==================*/    
  show(){
    this.BtnItem.setVisible(true);
    this.BtnInfo.setVisible(true);
    this.BtnFin.setVisible(true);
  }
  /*==================
  非表示
  ==================*/    
  hide(){
    this.BtnItem.setVisible(false);
    this.BtnInfo.setVisible(false);
    this.BtnFin.setVisible(false);    
  }
   
}