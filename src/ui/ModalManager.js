import Attack from './modal/Attack';
import Move from './modal/Move';
import Layout from './modal/Layout';
import LayoutAuto from './modal/LayoutAuto';
import LayoutFin from './modal/LayoutFin';
import Trap from './modal/Trap';
import NextTurn from './modal/NextTurn';

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
    this.nextTurn = new NextTurn({
      scene: this.scene
    });
    this.trap = new Trap({
      scene: this.scene
    });
  }
  close(){
    if(this.openModal){
      this.openModal.close();
    }
  }
}
  