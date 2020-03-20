
import ModalWindow       from './modal/ModalWindow';
import ModalLayout       from './modal/ModalLayout';

export default class ModalManager{
  constructor(config) {
    this.scene = config.scene;

    this.openModal = "";

    this.ModalWindow = new ModalWindow({
      scene: this.scene
    });
    this.ModalLayout = new ModalLayout({
      scene: this.scene
    });
  }
  open(status){
    // this.mordalWindow.setMordalText(status);
    if(status === "LAYOUT_MANUAL"){
      this.ModalLayout.open(status);
    }else{
      this.ModalWindow.open(status);
    }
  }
  close(){
    this.ModalWindow.close();
  }
  modalYes(){
    let manager = this.scene.StageManager;
    manager.modalYes();
  }
  modalNo(){
    let manager = this.scene.StageManager;
    manager.modalNo();
  }
}
  