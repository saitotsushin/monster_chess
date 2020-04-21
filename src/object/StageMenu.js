import ModalItem from './ui/modal/ModalItem';


export default class StageMenu {
  constructor(config) {
    this.scene = config.scene;
    this.create();
  }
  create(){
    this.flgItem = false;
    this.flgInfo = false;
    this.ModalItem = new ModalItem({
      scene: this.scene
    }); 
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
    this.btnItem = this.scene.add.sprite(
      20,
      184,
      'spritesheet',
      'btn_item'
    );
    this.btnItem.depth = 5
    
    this.btnItem.setInteractive();
    this.btnItem.on('pointerdown', () => {
      if(this.scene.StageManager.STATUS.STAGE === 'LAYOUT'){
        return;
      }
      /*インフォのリセット*/
      this.btnInfo.setTexture('spritesheet','btn_info2');
      this.ModalWindow.setVisible(false);
      this.scene.hideChessInfoWindow();
      this.flgInfo = false;
      /*移動エリア表示のリセット*/
      this.scene.StageManager.MoveArea.hide();
      if(this.flgItem === false){
        this.scene.StageManager.STATUS.STAGE = "ITEM";
        this.btnItem.setTexture('spritesheet','btn_item_close');
        this.flgItem = true;
        this.ModalItem.open();
      }else{
        this.scene.StageManager.STATUS.STAGE = "";
        this.btnItem.setTexture('spritesheet','btn_item');
        this.scene.TrapManager.Cursor.setVisible(false);
        this.flgItem = false;
        this.scene.PlayerManager.selectedTrap = "";
        this.ModalItem.close();
      }
    },this);

    /*==================
    ボタン：インフォ
    ==================*/
    this.btnInfo = this.scene.add.sprite(
      41,
      184,
      'spritesheet',
      'btn_info2'
    );
    this.btnInfo.setInteractive();
    this.btnInfo.on('pointerdown', () => {
      if(this.scene.StageManager.STATUS.STAGE === 'LAYOUT'){
        return;
      }
      this.scene.StageManager.MoveArea.hide();
      if(this.flgInfo === false){
        this.scene.StageManager.STATUS.STAGE = "INFO";
        this.btnInfo.setTexture('spritesheet','btn_info_close');
        this.flgInfo = true;
        this.ModalWindow.setVisible(true);
      }else{
        this.scene.StageManager.STATUS.STAGE = "";
        this.btnInfo.setTexture('spritesheet','btn_info2');
        this.flgInfo = false;
        this.ModalWindow.setVisible(false);
        this.ModalItem.close();
      }
    },this);

    /*==================
    ボタン：完了
    ==================*/
    this.btnFin = this.scene.add.sprite(
      116,
      184,
      'spritesheet',
      'btn_fin'
    );
    this.btnFin.setInteractive();
    this.btnFin.on('pointerdown', () => {
      if(this.scene.StageManager.STATUS.STAGE === 'LAYOUT'){
        return;
      }
      if(this.scene.StageManager.STATUS.MOVE === "FIN" || this.scene.StageManager.STATUS.ATTACK === "FIN"){
        this.scene.StageManager.turnFin();
      }
    },this);


  }

}