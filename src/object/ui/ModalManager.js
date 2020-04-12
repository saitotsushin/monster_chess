
import ModalAttack from './modal/ModalAttack';
import ModalMove from './modal/ModalMove';
export default class ModalManager{
  constructor(config) {
    this.scene = config.scene;

    this.openModal = "";
    this.create()
  }
  create(){
    this.ModalAttack = new ModalAttack({
      scene: this.scene
    });  
    this.ModalMove = new ModalMove({
      scene: this.scene
    });    
  }
  open(status){
    // this.mordalWindow.setMordalText(status);
    if(status === 'ATTACK'){
      this.ModalAttack.open();
    }
    if(status === 'MOVE'){
      this.ModalMove.open();
    }
  }
  close(){
    this.ModalAttack.close();
    this.ModalMove.close();
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
  