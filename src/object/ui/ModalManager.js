// import Attack     from './modal/Attack';
import Move       from './modal/Move';
// import Layout     from './modal/Layout';
import LayoutAuto from './modal/LayoutAuto';
// import LayoutFin  from './modal/LayoutFin';
import Trap       from './modal/Trap';
import NextTurn   from './modal/NextTurn';

export default class ModalManager{
  constructor(config) {
    this.scene = config.scene;

    this.openModal = "";

    // this.attack = new Attack({
    //   scene: this.scene
    // });
    this.Move = new Move({
      scene: this.scene
    });
    // this.layout = new Layout({
    //   scene: this.scene
    // });
    this.LayoutAuto = new LayoutAuto({
      scene: this.scene
    });
    // this.layoutFin = new LayoutFin({
    //   scene: this.scene
    // });
    this.NextTurn = new NextTurn({
      scene: this.scene
    });
    this.Trap = new Trap({
      scene: this.scene
    });
  }
  open(status){
    if(this.scene.StageManager.STATUS.STAGE === "INIT"){
      this.LayoutAuto.open();
    }
    if(this.scene.StageManager.STATUS.STAGE === "SELECTED_TRAP"){
      this.Trap.open();
    }
    if(this.scene.StageManager.STATUS.STAGE === "MOVE"){
      this.Move.open();
    }
    if(this.scene.StageManager.STATUS.STAGE === "FIN"){
      this.NextTurn.open();
    }          
  }
  close(){
    if(this.openModal){
      this.openModal.close();
    }
  }
}
  