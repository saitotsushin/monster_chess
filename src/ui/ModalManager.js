import Attack from './modal/Attack';
import Move from './modal/Move';
import Layout from './modal/Layout';
import LayoutAuto from './modal/LayoutAuto';
import LayoutFin from './modal/LayoutFin';

export default class ModalManager{
  constructor(config) {
    this.scene = config.scene;

    this.openModal = "";

    this.attack = new Attack({
      scene: this.scene
    });
    this.move = new Move({
      scene: this.scene
    });
    this.layout = new Layout({
      scene: this.scene
    });
    this.layoutAuto = new LayoutAuto({
      scene: this.scene
    });
    this.layoutFin = new LayoutFin({
      scene: this.scene
    });
  }
  close(){
    console.log("this.openModal",this.openModal)
    if(this.openModal){
      this.openModal.close();
    }
  }
}
  